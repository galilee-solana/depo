import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Depo } from '../target/types/depo'
import { v4 as uuidv4 } from 'uuid'
import { strict as assert } from 'assert'

describe('DEPO - Intruction: create_escrow', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  
  const program = anchor.workspace.Depo as Program<Depo>

  const initializer = Keypair.generate()

  beforeAll(async () => {
    const signature = await provider.connection.requestAirdrop(
      initializer.publicKey,
      10 * LAMPORTS_PER_SOL
    )

    await provider.connection.confirmTransaction(signature, 'confirmed')
  
    const balance = await provider.connection.getBalance(initializer.publicKey)

    assert(balance > 0, 'Airdrop failed')
  })

  it('Successfully add recipient and update escrow state', async () => {});
  it('Enforce initializer-only access control', async () => {});
  it('Enforce Draft status requirement', async () => {});
  it('Prevent duplicate recipient additions', async () => {});
});
