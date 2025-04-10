import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Depo } from '../target/types/depo'
import { v4 as uuidv4 } from 'uuid'
import { strict as assert } from 'assert'


describe('DEPO - Instruction: remove_recipient', () => {
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

  it('Successfully add and remove recipient and update escrow state', async () => {});
  it('Prevent removal of non-existent recipient', async () => {});
  it('Prevent removal on escrow with 0 recipients', async () => {});
  it('Enforce initializer-only access control', async () => {});
  it('Enforce Draft status requirement', async () => {
    // Can't be tested since we don't have a way to change the status of the escrow
    // TODO: Add a test for this once we have the started instruction
  });
});
