import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {
  Keypair,
  LAMPORTS_PER_SOL, PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction
} from '@solana/web3.js'
import {Depo} from '../target/types/depo'
import {v4 as uuidv4} from 'uuid'
import {strict as assert} from 'assert'
import {BN} from 'bn.js';


describe('add_target_amount instruction test', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Depo as Program<Depo>

  const initializer = Keypair.generate()

  let escrowKey: anchor.web3.PublicKey
  let targetAmountKey: anchor.web3.PublicKey
  let escrowId: Uint8Array

  beforeAll(async () => {
    const signature = await provider.connection.requestAirdrop(
        initializer.publicKey,
        10 * LAMPORTS_PER_SOL
    )

    await provider.connection.confirmTransaction(signature, 'confirmed')

    const balance = await provider.connection.getBalance(initializer.publicKey)
    assert(balance > 0, 'Airdrop failed')
  })

  beforeEach(async () => {
    // UUID Generation
    const uuid = uuidv4().replace(/-/g, '')
    // Convert UUID to Uint8Array (16 bytes)
    escrowId = Uint8Array.from(Buffer.from(uuid, 'hex'))

    // Escrow Name (100 bytes)
    const testName = 'TEST_ESCROW name'
    const name = Buffer.alloc(100)
    name.write(testName)

    // Escrow Description (200 bytes)
    const testDescription = 'TEST_ESCROW description'
    const description = Buffer.alloc(200)
    description.write(testDescription)

    const [escrowPDA, _escrowBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('escrow'), escrowId],
        program.programId
    )

    escrowKey = escrowPDA

    await program.methods.createEscrow(
        Array.from(escrowId),
        name,
        description
    )
    .accounts({
      escrow: escrowKey,
      signer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc()

    let escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(Buffer.from(escrowAccount.id).toString('hex')).toBe(uuid)

    const [targetAmountPDA, _] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('target_amount'), escrowKey.toBuffer()],
        program.programId
    )

    targetAmountKey = targetAmountPDA
  })


  it('creates a targetAmountAccount and adds a targetAmount module to the escrow', async () => {
    await program.methods.addTargetAmount(
        Array.from(escrowId),
        new BN(2 * LAMPORTS_PER_SOL),
    )
    .accounts({
      escrow: escrowKey,
      targetAmount: targetAmountKey,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc();

    const targetAmountAccount = await program.account.targetAmount.fetch(targetAmountKey);
    expect(targetAmountAccount.targetAmount.toNumber()).toBe(2 * LAMPORTS_PER_SOL);

    let escrowAccount = await program.account.escrow.fetch(escrowKey);

    expect(escrowAccount.modules).toHaveLength(1);

    const targetAmountModule = escrowAccount.modules.find(mod => {
      return mod.moduleType.targetAmount !== undefined;
    });
    expect(targetAmountModule).toBeTruthy();
    expect(targetAmountModule?.key.toBase58()).toBe(targetAmountKey.toBase58());
  })

  it('fails to add a second targetAmount module', async () => {
    await program.methods.addTargetAmount(
        Array.from(escrowId),
        new BN(2 * LAMPORTS_PER_SOL),
    )
    .accounts({
      escrow: escrowKey,
      targetAmount: targetAmountKey,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc();

    let error: any
    try {
      await program.methods.addTargetAmount(
          Array.from(escrowId),
          new BN(3 * LAMPORTS_PER_SOL),
      )
      .accounts({
        escrow: escrowKey,
        targetAmount: targetAmountKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([initializer])
      .rpc();
    } catch (err) {
      error = err;
    }

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/already in use/i);
  });

  it("fails if the escrow status is not 'draft'", async () => {
    // TODO: implement this test when it will be possible to change the status of the escrow
  });

  it("fails if the signer is not the escrow's initializer", async () => {
    const otherUser = Keypair.generate()
    const signature = await provider.connection.requestAirdrop(
        otherUser.publicKey,
        10 * LAMPORTS_PER_SOL
    )

    await provider.connection.confirmTransaction(signature, 'confirmed')

    let error: any
    try {
      await program.methods.addTargetAmount(
          Array.from(escrowId),
          new BN(3 * LAMPORTS_PER_SOL),
      )
      .accounts({
        escrow: escrowKey,
        targetAmount: targetAmountKey,
        initializer: otherUser.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([otherUser])
      .rpc()
    } catch (err) {
      error = err
    }

    expect(error).toBeTruthy()
    expect(error.message).toMatch(/AnchorError caused by account: escrow. Error Code: ConstraintHasOne. Error Number: 2001. Error Message: A has one constraint was violated./i)
  })
})