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
      name,
      description
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

  it('Same UUID should fail', async () => {
    // This test is to check if the same UUID can be used to create two different escrows
    // Should FAIL

    const uuid = uuidv4().replace(/-/g, '')
    const escrowId = Uint8Array.from(Buffer.from(uuid, 'hex'))

    const [escrowKey, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('escrow'), escrowId],
      program.programId
    )

    // Escrow Name (100 bytes)
    const testName = 'TEST_ESCROW name'
    const name = Buffer.from(testName, 'utf8')

    // Escrow Description (200 bytes)
    const testDescription = 'TEST_ESCROW description'
    const description = Buffer.from(testDescription, 'utf8')

    // First Escrow Creation
    await program.methods.createEscrow(
      Array.from(escrowId),
      name,
      description
    )
    .accounts({
      escrow: escrowKey,
      signer: initialiser.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initialiser])
    .rpc()

    try {
    // Second Escrow Creation
      await program.methods.createEscrow(
        Array.from(escrowId),
        name,
        description
      )
      .accounts({
        escrow: escrowKey,
        signer: initialiser.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([initialiser])
      .rpc()

      throw new Error('Expected method to throw due to same UUID, but it did not.')
    } catch (error: any) {
      expect(error.toString()).toContain(`account Address { address: ${escrowKey.toBase58()}, base: None } already in use`)
    }
  })

  it("MAX LEN (100 bytes): name", async () => {
    // This test is to check if the name can be more than 100 bytes
    // Should FAIL

    const uuid = uuidv4().replace(/-/g, '')
    const escrowId = Uint8Array.from(Buffer.from(uuid, 'hex'))

    const [escrowKey, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('escrow'), escrowId],
      program.programId
    )

    // Escrow Name (101 bytes)
    const testName = "a".repeat(101)
    const name = Buffer.from(testName, 'utf8')

    // Escrow Description (200 bytes)
    const testDescription = 'TEST_ESCROW description'
    const description = Buffer.from(testDescription, 'utf8')
    
    try {
      await program.methods.createEscrow(
        Array.from(escrowId),
        name,
        description
      )
      .accounts({ 
        escrow: escrowKey,
        signer: initialiser.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([initialiser])
      .rpc()
  
      throw new Error('Expected method to throw due to name > 100 bytes, but it did not.')
    } catch (error) {
      const anchorError = error as anchor.AnchorError
      expect(anchorError.error.errorCode.code).toBe('NameTooLong')
    }
  })


  it("MAX LEN (200 bytes) for description", async () => {
    const uuid = uuidv4().replace(/-/g, '')
    const escrowId = Uint8Array.from(Buffer.from(uuid, 'hex'))

    const [escrowKey, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('escrow'), escrowId],
      program.programId
    )

    // Escrow Name (101 bytes)
    const testName = "TEST_ESCROW name"
    const name = Buffer.from(testName, 'utf8')

    // Escrow Description (200 bytes)
    const testDescription = "a".repeat(201)
    const description = Buffer.from(testDescription, 'utf8')
    
    try {
      await program.methods.createEscrow(
        Array.from(escrowId),
        name,
        description
      )
      .accounts({ 
        escrow: escrowKey,
        signer: initialiser.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([initialiser])
      .rpc()
  
      throw new Error('Expected method to throw due to name > 100 bytes, but it did not.')
    } catch (error) {
      const anchorError = error as anchor.AnchorError
      expect(anchorError.error.errorCode.code).toBe('DescriptionTooLong')
    }
  })
})