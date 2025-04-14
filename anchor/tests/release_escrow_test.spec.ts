import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Depo } from '../target/types/depo'
import { v4 as uuidv4 } from 'uuid'
import { strict as assert } from 'assert'

describe('Test - Instruction: release_escrow', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Depo as Program<Depo>

  const initializer = Keypair.generate()
  const depositorWallet = Keypair.generate()

  let escrowKey: anchor.web3.PublicKey
  let escrowId: Uint8Array

  let depositorKey: anchor.web3.PublicKey

  let minimumAmountKey: anchor.web3.PublicKey

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
    const signatureDepositor = await provider.connection.requestAirdrop(
        depositorWallet.publicKey,
        10 * LAMPORTS_PER_SOL
    )
    await provider.connection.confirmTransaction(signatureDepositor, 'confirmed')
    const balanceDepositor = await provider.connection.getBalance(depositorWallet.publicKey)
    assert(balanceDepositor > 0, 'Airdrop failed')
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

    const [minimumAmountPDA, _] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('minimum_amount'), escrowKey.toBuffer()],
        program.programId
    )
    minimumAmountKey = minimumAmountPDA

    const [depositorPDA, _depositorBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('depositor'), escrowKey.toBuffer(), depositorWallet.publicKey.toBuffer()],
      program.programId
    )
    depositorKey = depositorPDA
  })

  it("Successfully released an escrow with one module: MinimunAmount", async () => {

  })

  it("Fails when module condition is not met", async () => {

  })

  it("Fails when the escrow isn't Started", async () => {

  })
  
  it("Fails when not all modules are provided in remaining_accounts", async () => {

  })

  it("Fails when providing duplicated module accounts", async () => {

  })

  it("Fails when providing invalid module accounts", async () => {

  })

  it("Fails when module account has invalid owner", async () => {

  })  

  it("Successfully released an escrow with multiple modules", () => {
    // TODO: This test need to be implemented when multiple modules are ready
  })
})
