import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Depo } from '../target/types/depo'
import { v4 as uuidv4 } from 'uuid'
import { strict as assert } from 'assert'


describe('Test - Instruction: remove_depositor', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  
  const program = anchor.workspace.Depo as Program<Depo>

  const initializer = Keypair.generate()
  const depositorWallet = Keypair.generate()

  let escrowKey: anchor.web3.PublicKey
  let escrowId: Uint8Array

  let depositorKey: anchor.web3.PublicKey

  beforeAll(async () => {
    // Airdrop to initializer
    const signature = await provider.connection.requestAirdrop(
      initializer.publicKey,
      10 * LAMPORTS_PER_SOL
    )
    await provider.connection.confirmTransaction(signature, 'confirmed')
    const balance = await provider.connection.getBalance(initializer.publicKey)
    assert(balance > 0, 'Airdrop failed')

    // Airdrop to depositor
    const signature2 = await provider.connection.requestAirdrop(
      depositorWallet.publicKey,
      10 * LAMPORTS_PER_SOL
    )
    await provider.connection.confirmTransaction(signature2, 'confirmed')
    const balance2 = await provider.connection.getBalance(depositorWallet.publicKey)
    assert(balance2 > 0, 'Airdrop failed')
  })

  beforeEach(async() => {
    const uuid = uuidv4().replace(/-/g, '')
    escrowId = Uint8Array.from(Buffer.from(uuid, 'hex'))

    // Escrow Name (100 bytes)
    const testName = 'TEST_ESCROW name'
    const name = Buffer.alloc(100)
    name.write(testName)

    // Escrow Description (200 bytes)
    const testDescription = 'TEST_ESCROW description'
    const description = Buffer.alloc(200)
    description.write(testDescription)

    const [escrowkey, _escrowBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('escrow'), escrowId],
      program.programId
    )

    escrowKey = escrowkey

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

    const [depositorkey, _depositorBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('depositor'), escrowKey.toBuffer(), depositorWallet.publicKey.toBuffer()],
      program.programId
    )

    depositorKey = depositorkey
  })

  it('Successfully Remove depositor and update escrow state', async () => {
    await program.methods.addDepositor(
      Array.from(escrowId),
      depositorWallet.publicKey
    )
    .accounts({
      escrow: escrowKey,
      depositor: depositorKey,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc()

    let escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(escrowAccount.depositorsCount).toBe(1)

    await program.methods.removeDepositor(
      Array.from(escrowId),
      depositorWallet.publicKey
    )
    .accounts({
      escrow: escrowKey,
      depositor: depositorKey,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc()

    escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(escrowAccount.depositorsCount).toBe(0)

    try {
      await program.account.depositor.fetch(depositorKey)
      throw new Error('Depositor account should not exist')
    } catch (error: any) {
      expect(error.message).toContain(`Account does not exist or has no data ${depositorKey.toBase58()}`)
    }
  });

  it('fails when removing a non-existent depositor', async () => {
    await program.methods.addDepositor(
      Array.from(escrowId),
      depositorWallet.publicKey
    )
    .accounts({
      escrow: escrowKey,
      depositor: depositorKey,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc()

    let escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(escrowAccount.depositorsCount).toBe(1)

    const depositorWallet2 = Keypair.generate()
    const [depositorKey2, depositorBump2] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('depositor'), escrowKey.toBuffer(), depositorWallet2.publicKey.toBuffer()],
      program.programId
    )

    try {
      await program.methods.removeDepositor(
        Array.from(escrowId),
        depositorWallet2.publicKey
      )
      .accounts({
        escrow: escrowKey,
        depositor: depositorKey2,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([initializer])
      .rpc()

      throw new Error('Should not be able to remove depositor since depositor does not exist')
    } catch (error: any) {
      expect(error.toString()).toContain('Error Code: AccountNotInitialized')
      expect(error.toString()).toContain('Error Message: The program expected this account to be already initialized.')
    }
  });
  it('fails when removing a depositor from an escrow with 0 depositors', async () => {
    try {
      await program.methods.removeDepositor(
        Array.from(escrowId),
        depositorWallet.publicKey
      )
      .accounts({
        escrow: escrowKey,
        depositor: depositorKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([initializer])
      .rpc()

      throw new Error('Should not be able to remove depositor since no depositors exist')
    } catch (error: any) {
      expect(error.toString()).toContain('Error Code: AccountNotInitialized')
      expect(error.toString()).toContain('Error Message: The program expected this account to be already initialized.')
    }
  });
  it('Fails when a non-initializer tries to remove a depositor', async () => {
    await program.methods.addDepositor(
      Array.from(escrowId),
      depositorWallet.publicKey
    )
    .accounts({
      escrow: escrowKey,
      depositor: depositorKey,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc()

    let escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(escrowAccount.depositorsCount).toBe(1)

    try {
      await program.methods.removeDepositor(
        Array.from(escrowId),
        depositorWallet.publicKey
      )
      .accounts({
        escrow: escrowKey,
        depositor: depositorKey,
        initializer: depositorWallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([depositorWallet])
      .rpc()

      throw new Error('Should not be able to remove depositor since initializer is not the signer')
    } catch (error: any) {
      expect(error.toString()).toContain('Error Code: UnauthorizedDepositorModifier')
      expect(error.toString()).toContain('Error Message: Unauthorized to add or remove depositor.')
    }
  });
  it('Enforce Draft status requirement', async () => {
    // Can't be tested since we don't have a way to change the status of the escrow
    // TODO: Add a test for this once we have the started instruction
  });
});
