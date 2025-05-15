import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, LAMPORTS_PER_SOL} from '@solana/web3.js'
import {Depo} from '../target/types/depo'
import {v4 as uuidv4} from 'uuid'
import {strict as assert} from 'assert'
import {BN} from 'bn.js';


describe('remove_timelock instruction test', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Depo as Program<Depo>

  const initializer = Keypair.generate()

  let escrowKey: anchor.web3.PublicKey
  let timelockKey: anchor.web3.PublicKey

  let escrowId: Uint8Array
  
  const oneDayInSeconds = 24 * 60 * 60;
  const nowPlusOneDay = Math.floor(Date.now() / 1000) + oneDayInSeconds;

  beforeAll(async () => {
    const signature = await provider.connection.requestAirdrop(
        initializer.publicKey,
        10 * LAMPORTS_PER_SOL
    )

    await provider.connection.confirmTransaction(signature, 'confirmed')

    const balance = await provider.connection.getBalance(initializer.publicKey)
    assert(balance > 0, 'Airdrop failed')
  });

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


    const [timelockPDA, _timelockBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('timelock'), escrowKey.toBuffer()],
        program.programId
    )

    timelockKey = timelockPDA

    await program.methods.addTimelock(
        Array.from(escrowId),
        new anchor.BN(nowPlusOneDay),
    )
    .accounts({
      escrow: escrowKey,
      timelock: timelockKey,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc();

  });


  it('removes the timelockAccount and removes the timelock account from the escrow module list', async () => {
    await program.methods.removeTimelock(Array.from(escrowId))
    .accounts({
      escrow: escrowKey,
      timelock: timelockKey,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc();

    let error: any
    try {
      await program.account.timelock.fetch(timelockKey)
    } catch (err) {
      error = err
    }

    expect(error).toBeDefined()
    expect(error.message).toMatch(/Account does not exist/i)

    let escrowAccount = await program.account.escrow.fetch(escrowKey);

    expect(escrowAccount.modules).toHaveLength(0);
  })

  it('fails to remove a second time a timelock module', async () => {
    await program.methods.removeTimelock(Array.from(escrowId))
    .accounts({
      escrow: escrowKey,
      timelock: timelockKey,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc();

    let error: any
    try {
      await program.methods.removeTimelock(Array.from(escrowId))
      .accounts({
        escrow: escrowKey,
        timelock: timelockKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([initializer])
      .rpc();
    } catch (err) {
      error = err;
    }

    expect(error).toBeTruthy();
    expect(error.message).toMatch(/AnchorError caused by account: timelock. Error Code: AccountNotInitialized. Error Number: 3012. Error Message: The program expected this account to be already initialized./i);
  });

  it("fails if the escrow status is not 'draft'", async () => {
    const recipientWallet = Keypair.generate()
    const [recipientPDA, _recipientBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('recipient'), escrowKey.toBuffer(), recipientWallet.publicKey.toBuffer()],
        program.programId
    )

    await program.methods.addRecipient(
        Array.from(escrowId),
        recipientWallet.publicKey,
        100 * 100
    )
    .accounts({
      escrow: escrowKey,
      recipient: recipientPDA,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc()

    await program.methods.startEscrow(
        Array.from(escrowId)
    )
    .accounts({
      escrow: escrowKey,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).signers([initializer])
    .rpc()

    const escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(escrowAccount.status).toEqual({started: {}});

    let error: any
    try {
      await program.methods.removeTimelock(Array.from(escrowId))
      .accounts({
        escrow: escrowKey,
        timelock: timelockKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([initializer])
      .rpc()
    } catch (err) {
      error = err
    }

    expect(error).toBeDefined()
    expect(error.error.errorCode.code).toBe("EscrowNotDraft")
    expect(error.error.errorMessage).toBe("Escrow must be in Draft status to modify it")
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
      await program.methods.removeTimelock(Array.from(escrowId))
      .accounts({
        escrow: escrowKey,
        timelock: timelockKey,
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
});