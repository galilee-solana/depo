import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Depo } from '../target/types/depo'
import { before } from 'node:test'
import { v4 as uuidv4 } from 'uuid'
import { strict as assert } from 'assert'

describe('DEPO - Intruction: create_escrow', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  
  const program = anchor.workspace.Depo as Program<Depo>

  const initialiser = Keypair.generate()

  beforeAll(async () => {
    const signature = await provider.connection.requestAirdrop(
      initialiser.publicKey,
      10 * LAMPORTS_PER_SOL
    )

    await provider.connection.confirmTransaction(signature, 'confirmed')
  
    const balance = await provider.connection.getBalance(initialiser.publicKey)

    assert(balance > 0, 'Airdrop failed')
  })

  it('Create Escrow', async () => {
    // UUID Generation
    const uuid = uuidv4().replace(/-/g, '')
    // Convert UUID to Uint8Array (16 bytes)
    const escrowId = Uint8Array.from(Buffer.from(uuid, 'hex'))

    // Escrow Name (100 bytes)
    const testName = 'TEST_ESCROW name'
    const name = Buffer.alloc(100)
    name.write(testName)

    // Escrow Description (200 bytes)
    const testDescription = 'TEST_ESCROW description'
    const description = Buffer.alloc(200)
    description.write(testDescription)

    const [escrowKey, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('escrow'), escrowId],
      program.programId
    )

    await program.methods.createEscrow(
      Array.from(escrowId),
      Array.from(name),
      Array.from(description)
    )
    .accounts({
      escrow: escrowKey,
      signer: initialiser.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initialiser])
    .rpc()

    const escrowAccount = await program.account.escrow.fetch(escrowKey)
    expect(Buffer.from(escrowAccount.id).toString('hex')).toBe(uuid)
    expect(escrowAccount.initialiser.toBase58()).toBe(initialiser.publicKey.toBase58())

    // Convert the bytes to strings and remove trailing null characters
    const storedName = Buffer.from(escrowAccount.name).toString().replace(/\0/g, '')
    const storedDescription = Buffer.from(escrowAccount.description).toString().replace(/\0/g, '')

    expect(storedName).toBe(testName)
    expect(storedDescription).toBe(testDescription)
    expect(escrowAccount.totalAmount.toNumber()).toBe(0)
    expect(escrowAccount.isPublicDeposit).toBe(true)
    expect(escrowAccount.depositorsCount).toBe(0)
    expect(escrowAccount.recipientsCount).toBe(0)
    expect(escrowAccount.status).toEqual({ draft: {} })
    expect(escrowAccount.modules).toEqual([])
  })

  it.skip('Create Escrow with same UUID should fail', async () => {
    // TODO: Implement this test
    // 1. Create a new escrow
    // 2. Try to create another escrow with the same UUID
    // 3. Assert that the second creation fails
  })

  it.skip("MAX LEN (100 bytes) for name", async () => {
    // TODO: Implement this test
    // 1. Try to create a new escrow with a name of 101 bytes
    // 2. Assert that the creation fails
  })


  it.skip("MAX LEN (200 bytes) for description", async () => {
    // TODO: Implement this test
    // 1. Try to create a new escrow with a description of 201 bytes
    // 2. Assert that the creation fails
  })
})