import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Depo } from '../target/types/depo'
import { before } from 'node:test'
import { v4 as uuidv4 } from 'uuid'

describe('DEPO', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  
  const program = anchor.workspace.Depo as Program<Depo>

  const initialiser = Keypair.generate()

  before(async () => {
    // Airdrop SOL to the initialiser
    const airdropSig = await provider.connection.requestAirdrop(
      initialiser.publicKey, 
      10 *anchor.web3.LAMPORTS_PER_SOL
    )
    await provider.connection.confirmTransaction(airdropSig)
  })

  it('Initialize Depo', async () => {
    await program.methods.createEscrow(
      uuidv4(),

    )
      .accounts({
        depo: initialiser.publicKey,
      })
      .signers([initialiser])
      .rpc()
})