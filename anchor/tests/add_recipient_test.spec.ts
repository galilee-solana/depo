import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Depo } from '../target/types/depo'
import { v4 as uuidv4 } from 'uuid'
import { strict as assert } from 'assert'


describe('DEPO - Instruction: add_recipient', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  
  const program = anchor.workspace.Depo as Program<Depo>

  const initializer = Keypair.generate()
  const recipientWallet = Keypair.generate()

  beforeAll(async () => {
    // Airdrop to initializer
    const signature = await provider.connection.requestAirdrop(
      initializer.publicKey,
      10 * LAMPORTS_PER_SOL
    )
    await provider.connection.confirmTransaction(signature, 'confirmed')
    const balance = await provider.connection.getBalance(initializer.publicKey)
    assert(balance > 0, 'Airdrop failed')

    // Airdrop to recipient
    const signature2 = await provider.connection.requestAirdrop(
      recipientWallet.publicKey,
      10 * LAMPORTS_PER_SOL
    )
    await provider.connection.confirmTransaction(signature2, 'confirmed')
    const balance2 = await provider.connection.getBalance(recipientWallet.publicKey)
    assert(balance2 > 0, 'Airdrop failed')
  })

  it('Successfully add recipient and update escrow state', async () => {
    const uuid = uuidv4().replace(/-/g, '')
    const escrowId = Uint8Array.from(Buffer.from(uuid, 'hex'))

    const [escrowKey, _escrowBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('escrow'), escrowId],
      program.programId
    )

    const testName = 'TEST_ESCROW name'
    const name = Buffer.from(testName, 'utf8')

    const testDescription = 'TEST_ESCROW description'
    const description = Buffer.from(testDescription, 'utf8')

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
    expect(escrowAccount.recipientsCount).toBe(0)

    const [recipientKey, recipientBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('recipient'), escrowKey.toBuffer(), recipientWallet.publicKey.toBuffer()],
      program.programId
    )

    await program.methods.addRecipient(
      Array.from(escrowId),
      recipientWallet.publicKey
    )
    .accounts({
      escrow: escrowKey,
      recipient: recipientKey,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc()

    escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(escrowAccount.recipientsCount).toBe(1)
    
    const recipientAccount = await program.account.recipient.fetch(recipientKey)
    expect(recipientAccount.escrow.toBase58()).toBe(escrowKey.toBase58())
    expect(recipientAccount.wallet.toBase58()).toBe(recipientWallet.publicKey.toBase58())
    expect(recipientAccount.amount.toNumber()).toBe(0)
    expect(recipientAccount.hasWithdrawn).toBe(false)
  });
  it('Enforce initializer-only access control', async () => {
    const uuid = uuidv4().replace(/-/g, '')
    const escrowId = Uint8Array.from(Buffer.from(uuid, 'hex'))

    const [escrowKey, _escrowBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('escrow'), escrowId],
      program.programId
    )

    const testName = 'TEST_ESCROW name'
    const name = Buffer.from(testName, 'utf8')

    const testDescription = 'TEST_ESCROW description'
    const description = Buffer.from(testDescription, 'utf8')

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

    const [recipientKey, recipientBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('recipient'), escrowKey.toBuffer(), recipientWallet.publicKey.toBuffer()],
      program.programId
    )
    try {
      await program.methods.addRecipient(
        Array.from(escrowId),
        recipientWallet.publicKey
      )
      .accounts({
        escrow: escrowKey,
        recipient: recipientKey,
        initializer: recipientWallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([recipientWallet])
      .rpc()

      throw new Error('Should not be able to add recipient since initializer is not the signer')
    } catch (error: any) {
      expect(error.toString()).toContain('Error Code: UnauthorizedRecipientModifier')
      expect(error.toString()).toContain('Error Message: Unauthorized to add or remove recipient.')
    }
  });
  it('Prevent duplicate recipient additions', async () => {
    const uuid = uuidv4().replace(/-/g, '')
    const escrowId = Uint8Array.from(Buffer.from(uuid, 'hex'))

    const [escrowKey, _escrowBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('escrow'), escrowId],
      program.programId
    )

    const testName = 'TEST_ESCROW name'
    const name = Buffer.from(testName, 'utf8')

    const testDescription = 'TEST_ESCROW description'
    const description = Buffer.from(testDescription, 'utf8')

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
    expect(escrowAccount.recipientsCount).toBe(0)

    const [recipientKey, recipientBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('recipient'), escrowKey.toBuffer(), recipientWallet.publicKey.toBuffer()],
      program.programId
    )

    await program.methods.addRecipient(
      Array.from(escrowId),
      recipientWallet.publicKey
    )
    .accounts({
      escrow: escrowKey,
      recipient: recipientKey,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc()

    escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(escrowAccount.recipientsCount).toBe(1)

    try {
      await program.methods.addRecipient(
        Array.from(escrowId),
        recipientWallet.publicKey
      )
      .accounts({
        escrow: escrowKey,
        recipient: recipientKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([initializer])
      .rpc()

      throw new Error('Should not be able to add recipient since recipient already exists')
    } catch (error: any) {
      expect(error.toString()).toContain(`account Address { address: ${recipientKey.toBase58()}, base: None } already in use`)
    }
  });
  it('Enforce Draft status requirement', async () => {
    // Can't be tested since we don't have a way to change the status of the escrow
    // TODO: Add a test for this once we have the started instruction
  });
});
