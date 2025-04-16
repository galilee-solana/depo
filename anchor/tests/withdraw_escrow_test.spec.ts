import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, LAMPORTS_PER_SOL} from '@solana/web3.js'
import {Depo} from '../target/types/depo'
import {v4 as uuidv4} from 'uuid'
import {strict as assert} from 'assert'
import {BN} from "bn.js";


describe('Test - Instruction: withdraw_escrow', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Depo as Program<Depo>

  const initializer = Keypair.generate()
  const depositorWallet = Keypair.generate()
  const recipientWallet = Keypair.generate()
  const otherRecipientWallet = Keypair.generate()

  let escrowKey: anchor.web3.PublicKey
  let escrowId: Uint8Array

  let depositorKey: anchor.web3.PublicKey
  let recipientKey: anchor.web3.PublicKey
  let otherRecipientKey: anchor.web3.PublicKey

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

    const [depositorPDA, _depositorBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('depositor'), escrowKey.toBuffer(), depositorWallet.publicKey.toBuffer()],
        program.programId
    )

    await program.methods.addDepositor(
        Array.from(escrowId),
        depositorWallet.publicKey
    )
    .accounts({
      escrow: escrowKey,
      depositor: depositorPDA,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc()

    const [recipientPDA, _recipientBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('recipient'), escrowKey.toBuffer(), recipientWallet.publicKey.toBuffer()],
        program.programId
    )
    recipientKey = recipientPDA

    await program.methods.addRecipient(
        Array.from(escrowId),
        recipientWallet.publicKey,
        95 * 100
    )
    .accounts({
      escrow: escrowKey,
      recipient: recipientKey,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc()

    const [otherRecipientPDA, _otherRecipientBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('recipient'), escrowKey.toBuffer(), otherRecipientWallet.publicKey.toBuffer()],
        program.programId
    )
    otherRecipientKey = otherRecipientPDA

    await program.methods.addRecipient(
        Array.from(escrowId),
        otherRecipientWallet.publicKey,
        5 * 100
    )
    .accounts({
      escrow: escrowKey,
      recipient: otherRecipientKey,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc()

    await program.methods.startEscrow(
        Array.from(escrowId)
    )
    .accounts({
      escrow: escrowKey,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).signers([initializer])
    .rpc()

    await program.methods.depositEscrow(
        Array.from(escrowId),
        new BN(2 * LAMPORTS_PER_SOL)
    ).accounts(
        {
          escrow: escrowKey,
          depositor: depositorKey,
          signer: depositorWallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
    ).signers([depositorWallet]).rpc()
  })

  describe("when the escrow is in released state", () => {
    beforeEach(async () => {
      await program.methods.releaseEscrow(
          Array.from(escrowId)
      ).accounts({
        escrow: escrowKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).signers([initializer]).rpc();

      let escrow = await program.account.escrow.fetch(escrowKey)
      expect(escrow.status).toEqual({released: {}});
    })

    it('withdraw escrow', async () => {
      const recipientBalanceBefore = await provider.connection.getBalance(recipientWallet.publicKey)

      await program.methods.withdrawEscrow(
          Array.from(escrowId)
      ).accounts({
        escrow: escrowKey,
        recipient: recipientKey,
        signer: recipientWallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).signers([recipientWallet]).rpc()

      let escrowAccount = await program.account.escrow.fetch(escrowKey)
      expect(escrowAccount.withdrawnAmount.toNumber()).toEqual(1.9 * LAMPORTS_PER_SOL);


      const recipientAccount = await program.account.recipient.fetch(recipientKey)
      expect(recipientAccount.hasWithdrawn).toBeTruthy()

      const recipientBalanceAfter = await provider.connection.getBalance(recipientWallet.publicKey)
      expect(recipientBalanceAfter - recipientBalanceBefore).toBe(1.9 * LAMPORTS_PER_SOL)

      const otherRecipientBalanceBefore = await provider.connection.getBalance(otherRecipientWallet.publicKey)

      await program.methods.withdrawEscrow(
          Array.from(escrowId)
      ).accounts({
        escrow: escrowKey,
        recipient: otherRecipientKey,
        signer: otherRecipientWallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).signers([otherRecipientWallet]).rpc()

      const otherRecipientAccount = await program.account.recipient.fetch(otherRecipientKey)
      expect(otherRecipientAccount.hasWithdrawn).toBeTruthy()

      const otherRecipientBalanceAfter = await provider.connection.getBalance(otherRecipientWallet.publicKey)
      expect(otherRecipientBalanceAfter - otherRecipientBalanceBefore).toBe(0.1 * LAMPORTS_PER_SOL)

      escrowAccount = await program.account.escrow.fetch(escrowKey)
      expect(escrowAccount.withdrawnAmount.toNumber()).toEqual(2 * LAMPORTS_PER_SOL);

    })

    it("fails when the recipient has already withdrawn", async () => {
      await program.methods.withdrawEscrow(
          Array.from(escrowId)
      ).accounts({
        escrow: escrowKey,
        recipient: recipientKey,
        signer: recipientWallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).signers([recipientWallet]).rpc()

      let recipientAccount = await program.account.recipient.fetch(recipientKey)
      expect(recipientAccount.hasWithdrawn).toBeTruthy()

      let error: any
      try {
        await program.methods.withdrawEscrow(
            Array.from(escrowId)
        ).accounts({
          escrow: escrowKey,
          recipient: recipientKey,
          signer: recipientWallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }).signers([recipientWallet]).rpc()
      } catch (err) {
        error = err
      }

      expect(error.error.errorCode.code).toBe("AlreadyWithdrawn")
      expect(error.error.errorMessage).toBe("Recipient has already withdrawn")
    })
  })

  describe("when the escrow is still in started state", () => {
    it("fails to withdraw", async () => {
      let error: any
      try {
        await program.methods.withdrawEscrow(
            Array.from(escrowId)
        ).accounts({
          escrow: escrowKey,
          recipient: recipientKey,
          signer: recipientWallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }).signers([recipientWallet]).rpc()
      } catch (err) {
        error = err
      }

      expect(error.error.errorCode.code).toBe("WithdrawInvalidEscrowStatus")
      expect(error.error.errorMessage).toBe("Withdraw is only available when the escrow is released")
    })
  })


});