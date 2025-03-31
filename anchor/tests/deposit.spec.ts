import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair } from '@solana/web3.js'
import { Deposit } from '../target/types/deposit'

describe('deposit', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Deposit as Program<Deposit>

  const depositKeypair = Keypair.generate()

  it('Initialize Deposit', async () => {
    await program.methods
      .initialize()
      .accounts({
        deposit: depositKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([depositKeypair])
      .rpc()

    const currentCount = await program.account.deposit.fetch(depositKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Deposit', async () => {
    await program.methods.increment().accounts({ deposit: depositKeypair.publicKey }).rpc()

    const currentCount = await program.account.deposit.fetch(depositKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Deposit Again', async () => {
    await program.methods.increment().accounts({ deposit: depositKeypair.publicKey }).rpc()

    const currentCount = await program.account.deposit.fetch(depositKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Deposit', async () => {
    await program.methods.decrement().accounts({ deposit: depositKeypair.publicKey }).rpc()

    const currentCount = await program.account.deposit.fetch(depositKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set deposit value', async () => {
    await program.methods.set(42).accounts({ deposit: depositKeypair.publicKey }).rpc()

    const currentCount = await program.account.deposit.fetch(depositKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the deposit account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        deposit: depositKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.deposit.fetchNullable(depositKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
