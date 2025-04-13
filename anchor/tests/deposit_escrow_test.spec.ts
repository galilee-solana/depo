import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair, LAMPORTS_PER_SOL} from '@solana/web3.js'
import {Depo} from '../target/types/depo'
import {v4 as uuidv4} from 'uuid'
import {strict as assert} from 'assert'
import {BN} from "bn.js";


describe('Test - Instruction: deposit_escrow', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Depo as Program<Depo>

  const initializer = Keypair.generate()
  const depositorWallet = Keypair.generate()

  let escrowKey: anchor.web3.PublicKey
  let escrowId: Uint8Array

  let depositorKey: anchor.web3.PublicKey

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

    depositorKey = depositorPDA
  })


  describe("when depositor exists", () => {
    beforeEach(async () => {
      await program.methods.addDepositor(
          Array.from(escrowId),
          depositorWallet.publicKey
      )
      .accounts({
        escrow: escrowKey,
        depositor: depositorKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([initializer])
      .rpc()

      let escrowAccount = await program.account.escrow.fetch(escrowKey)
      expect(escrowAccount.depositorsCount).toBe(1)

      const depositorAccount = await program.account.depositor.fetch(depositorKey)
      expect(depositorAccount.depositedAmount.toNumber()).toBe(0);
    });

    describe("when the escrow is started", () => {
      beforeEach(async () => {
        await program.methods.startEscrow(
            Array.from(escrowId)
        )
        .accounts({
          escrow: escrowKey,
          initializer: initializer.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }).signers([initializer])
        .rpc()

        const escrowAccount = await program.account.escrow.fetch(escrowKey)
        expect(escrowAccount.status).toEqual({started: {}});
      })

      it("deposits funds to the escrow", async () => {
        let depositorBalance = await provider.connection.getBalance(depositorWallet.publicKey);
        expect(depositorBalance).toBe(10 * LAMPORTS_PER_SOL);

        let escrowBalanceBefore = await provider.connection.getBalance(escrowKey);

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

        const depositorAccount = await program.account.depositor.fetch(depositorKey)
        expect(depositorAccount.depositedAmount.toNumber()).toBe(2 * LAMPORTS_PER_SOL)

        depositorBalance = await provider.connection.getBalance(depositorWallet.publicKey)
        expect(depositorBalance).toBe(8 * LAMPORTS_PER_SOL)

        let escrowBalanceAfter = await provider.connection.getBalance(escrowKey)
        expect(escrowBalanceAfter - escrowBalanceBefore).toBe(2 * LAMPORTS_PER_SOL)

        let escrow = await program.account.escrow.fetch(escrowKey)
        expect(escrow.depositedAmount.toNumber()).toBe(2 * LAMPORTS_PER_SOL)
      });

      it("fails when amount is zero", async () => {
        let err: any
        try {
          await program.methods.depositEscrow(
              Array.from(escrowId),
              new BN(0)
          ).accounts(
              {
                escrow: escrowKey,
                depositor: depositorKey,
                signer: depositorWallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
              }
          ).signers([depositorWallet]).rpc()
        } catch (error) {
          err = error
        }

        expect(err).toBeDefined()
        expect(err.error.errorCode.code).toBe("InvalidDepositAmount")
        expect(err.error.errorMessage).toBe("Invalid deposit amount.")
      });

      it("fails when someone else tries to deposit for the depositor", async () => {
        const otherWallet = Keypair.generate();
        const signature = await provider.connection.requestAirdrop(
            otherWallet.publicKey,
            10 * LAMPORTS_PER_SOL
        )
        await provider.connection.confirmTransaction(signature, 'confirmed')

        let err: any
        try {
          await program.methods.depositEscrow(
              Array.from(escrowId),
              new BN(2 * LAMPORTS_PER_SOL)
          ).accounts(
              {
                escrow: escrowKey,
                depositor: depositorKey,
                signer: otherWallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
              }
          ).signers([otherWallet]).rpc()
        } catch (error) {
          err = error
        }

        expect(err).toBeDefined()
        expect(err.error.errorCode.code).toBe("ConstraintSeeds")
        expect(err.error.errorMessage).toBe("A seeds constraint was violated")
      })

      it("fails to deposit from someone who is not a depositor", async () => {
        const otherWallet = Keypair.generate();
        const signature = await provider.connection.requestAirdrop(
            otherWallet.publicKey,
            10 * LAMPORTS_PER_SOL
        )
        await provider.connection.confirmTransaction(signature, 'confirmed')

        const [nonExistingDepositorPDA, _depositorBump] = anchor.web3.PublicKey.findProgramAddressSync(
            [Buffer.from('depositor'), escrowKey.toBuffer(), otherWallet.publicKey.toBuffer()],
            program.programId
        )

        let err: any
        try {
          await program.methods.depositEscrow(
              Array.from(escrowId),
              new BN(2 * LAMPORTS_PER_SOL)
          ).accounts(
              {
                escrow: escrowKey,
                depositor: nonExistingDepositorPDA,
                signer: otherWallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
              }
          ).signers([otherWallet]).rpc()
        } catch (error) {
          err = error
        }
        expect(err).toBeDefined()
        expect(err.error.errorCode.code).toBe("AccountNotInitialized")
        expect(err.error.errorMessage).toBe("The program expected this account to be already initialized")
      });
    })
    describe("when the escrow is not started", () => {
      it("fails to deposit", async () => {
        let err: any
        try {
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
        } catch (error) {
          err = error
        }

        expect(err).toBeDefined()
        expect(err.error.errorCode.code).toBe("EscrowNotStarted")
        expect(err.error.errorMessage).toBe("Escrow must be in Draft status to modify it")
      })
    })
  })

  describe("when depositor does not exist", () => {
    describe("when the escrow is started", () => {
      beforeEach(async () => {
        await program.methods.startEscrow(
            Array.from(escrowId)
        )
        .accounts({
          escrow: escrowKey,
          initializer: initializer.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }).signers([initializer])
        .rpc()

        const escrowAccount = await program.account.escrow.fetch(escrowKey)
        expect(escrowAccount.status).toEqual({started: {}});
      })

      it("fails to deposit", async () => {
        let err: any
        try {
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
        } catch (error) {
          err = error
        }

        expect(err).toBeDefined()
        expect(err.error.errorCode.code).toBe("AccountNotInitialized")
        expect(err.error.errorMessage).toBe("The program expected this account to be already initialized")
      })
    })
    describe("when the escrow is not started", () => {
      it("fails to deposit", async () => {
        let err: any
        try {
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
        } catch (error) {
          err = error
        }

        expect(err).toBeDefined()
        expect(err.error.errorCode.code).toBe("AccountNotInitialized")
        expect(err.error.errorMessage).toBe("The program expected this account to be already initialized")
      })
    })
  })

});