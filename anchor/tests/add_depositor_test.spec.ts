import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Depo } from '../target/types/depo'
import { v4 as uuidv4 } from 'uuid'
import { strict as assert } from 'assert'
import {BN} from "bn.js";


describe('Test - Instruction: add_depositor', () => {
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

  it('Successfully add depositor: Verify escrow state and depositor account', async () => {
    let escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(escrowAccount.depositorsCount).toBe(0)

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

    escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(escrowAccount.depositorsCount).toBe(1)
    expect(escrowAccount.depositedAmount.toNumber()).toBe(0)

    const depositorAccount = await program.account.depositor.fetch(depositorKey)
    expect(depositorAccount.escrow.toBase58()).toBe(escrowKey.toBase58())
    expect(depositorAccount.wallet.toBase58()).toBe(depositorWallet.publicKey.toBase58())
    expect(depositorAccount.depositedAmount.toNumber()).toBe(0)
    expect(depositorAccount.wasRefunded).toBe(false)
  });
  it('Fails when a non-initializer tries to add a depositor', async () => {
    try {
      await program.methods.addDepositor(
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

      throw new Error('Should not be able to add depositor since initializer is not the signer')
    } catch (error: any) {
      expect(error.toString()).toContain('Error Code: UnauthorizedDepositorModifier')
      expect(error.toString()).toContain('Error Message: Unauthorized to add or remove depositor.')
    }
  });
  it('fails when adding a duplicate depositor', async () => {
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

    const escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(escrowAccount.depositorsCount).toBe(1)

    try {
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

      throw new Error('Should not be able to add depositor since depositor already exists')
    } catch (error: any) {
      expect(error.toString()).toContain(`account Address { address: ${depositorKey.toBase58()}, base: None } already in use`)
    }
  });
  it('Enforce Draft status requirement', async () => {
    // Can't be tested since we don't have a way to change the status of the escrow
    // TODO: Add a test for this once we have the started instruction
  });
});
