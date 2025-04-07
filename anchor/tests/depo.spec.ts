import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Depo } from '../target/types/depo'
import { before } from 'node:test'
import { v4 as uuidv4 } from 'uuid'

describe('DEPO', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  
  const program = anchor.workspace.Depo as Program<Depo>

  const initialiser = Keypair.generate()

  beforeAll(async () => {
    const sig = await provider.connection.requestAirdrop(
      initialiser.publicKey,
      10 * LAMPORTS_PER_SOL
    )

    await provider.connection.confirmTransaction(sig, 'confirmed')
  
    const balance = await provider.connection.getBalance(initialiser.publicKey)
    console.log('Balance:', balance / LAMPORTS_PER_SOL, 'SOL')
    if (balance === 0) throw new Error('Airdrop failed')
  })

  it('Create Escrow', async () => {
    // UUID Generation
    const uuid = uuidv4().replace(/-/g, '')
    // Convert UUID to Uint8Array (16 bytes)
    const escrowId = new Uint8Array(16)
    for (let i = 0; i < 16; i++) {
      escrowId[i] = parseInt(uuid.slice(i * 2, i * 2 + 2), 16)
    }

    // Escrow Name (100 bytes)
    const name = Buffer.alloc(100)
    name.write('TEST_ESCROW name')

    // Escrow Description (200 bytes) 
    const description = Buffer.alloc(200)
    description.write('TEST_ESCROW description')

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

    console.log('Created escrow with UUID:', uuid)
  })
})