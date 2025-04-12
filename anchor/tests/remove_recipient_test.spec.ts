import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Depo } from '../target/types/depo'
import { v4 as uuidv4 } from 'uuid'
import { strict as assert } from 'assert'


describe('Test - Instruction: remove_recipient', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  
  const program = anchor.workspace.Depo as Program<Depo>

  const initializer = Keypair.generate()
  const recipientWallet = Keypair.generate()

  let escrowKey: anchor.web3.PublicKey
  let escrowId: Uint8Array

  let recipientKey: anchor.web3.PublicKey

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

    const [recipientkey, _recipientBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('recipient'), escrowKey.toBuffer(), recipientWallet.publicKey.toBuffer()],
      program.programId
    )

    recipientKey = recipientkey
  })

  it('Successfully Remove recipient and update escrow state', async () => {
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

    let escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(escrowAccount.recipientsCount).toBe(1)

    await program.methods.removeRecipient(
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
    expect(escrowAccount.recipientsCount).toBe(0)

    try {
      await program.account.recipient.fetch(recipientKey)
      throw new Error('Recipient account should not exist')
    } catch (error: any) {
      expect(error.message).toContain(`Account does not exist or has no data ${recipientKey.toBase58()}`)
    }
  });

  it('fails when removing a non-existent recipient', async () => {

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

    let escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(escrowAccount.recipientsCount).toBe(1)

    const recipientWallet2 = Keypair.generate()
    const [recipientKey2, recipientBump2] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('recipient'), escrowKey.toBuffer(), recipientWallet2.publicKey.toBuffer()],
      program.programId
    )

    try {
      await program.methods.removeRecipient(
        Array.from(escrowId),
        recipientWallet.publicKey
      )
      .accounts({
        escrow: escrowKey,
        recipient: recipientKey2,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([initializer])
      .rpc()

      throw new Error('Should not be able to remove recipient since recipient does not exist')
    } catch (error: any) {
      expect(error.toString()).toContain('Error Code: AccountNotInitialized')
      expect(error.toString()).toContain('Error Message: The program expected this account to be already initialized.')
    }
  });
  it('fails when removing a recipient from an escrow with 0 recipients', async () => {
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

    let escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(escrowAccount.recipientsCount).toBe(1)

    await program.methods.removeRecipient(
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
    expect(escrowAccount.recipientsCount).toBe(0)

    try {
      await program.account.recipient.fetch(recipientKey)
      throw new Error('Recipient account should not exist')
    } catch (error: any) {
      expect(error.message).toContain(`Account does not exist or has no data ${recipientKey.toBase58()}`)
    }
  });

  it('fails when removing a non-existent recipient', async () => {
    try {
      await program.methods.removeRecipient(
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

      throw new Error('Should not be able to remove recipient since no recipients exist')
    } catch (error: any) {
      expect(error.toString()).toContain('Error Code: AccountNotInitialized')
      expect(error.toString()).toContain('Error Message: The program expected this account to be already initialized.')
    }
  });
  it('Fails when a non-initializer tries to remove a recipient', async () => {
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

    let escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(escrowAccount.recipientsCount).toBe(1)

    try {
      await program.methods.removeRecipient(
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

      throw new Error('Should not be able to remove recipient since initializer is not the signer')
    } catch (error: any) {
      expect(error.toString()).toContain('Error Code: UnauthorizedRecipientModifier')
      expect(error.toString()).toContain('Error Message: Unauthorized to add or remove recipient.')
    }
  });
  it('Enforce Draft status requirement', async () => {
    // Can't be tested since we don't have a way to change the status of the escrow
    // TODO: Add a test for this once we have the started instruction
  });
});
