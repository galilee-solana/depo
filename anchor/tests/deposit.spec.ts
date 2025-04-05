import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Depo } from '../target/types/depo'
// TODO: this is kept just for example, but to remove when first tests are implemented
describe.skip('depo', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Depo as Program<Depo>

  const depositKeypair = Keypair.generate()

  it('Initialize Depo', async () => {
    await program.methods
      .initialize()
      .accounts({
        depo: depositKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([depositKeypair])
      .rpc()

    const currentCount = await program.account.depo.fetch(depositKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Depo', async () => {
    await program.methods.increment().accounts({ depo: depositKeypair.publicKey }).rpc()

    const currentCount = await program.account.depo.fetch(depositKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Depo Again', async () => {
    await program.methods.increment().accounts({ depo: depositKeypair.publicKey }).rpc()

    const currentCount = await program.account.depo.fetch(depositKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Depo', async () => {
    await program.methods.decrement().accounts({ depo: depositKeypair.publicKey }).rpc()

    const currentCount = await program.account.depo.fetch(depositKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set depo value', async () => {
    await program.methods.set(42).accounts({ depo: depositKeypair.publicKey }).rpc()

    const currentCount = await program.account.depo.fetch(depositKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the depo account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        depo: depositKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.depo.fetchNullable(depositKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
