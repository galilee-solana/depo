import * as anchor from '@coral-xyz/anchor'
import { BN, Program } from '@coral-xyz/anchor'
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
  const recipientWallet = Keypair.generate()

  let escrowKey: anchor.web3.PublicKey
  let escrowId: Uint8Array

  let depositorKey: anchor.web3.PublicKey
  let recipientKey: anchor.web3.PublicKey

  let minimumAmountKey: anchor.web3.PublicKey
  let timelockKey: anchor.web3.PublicKey

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

    const [depositorPDA, _depositorBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('depositor'), escrowKey.toBuffer(), depositorWallet.publicKey.toBuffer()],
      program.programId
    )
    depositorKey = depositorPDA

    const [recipientPDA, _recipientBump] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('recipient'), escrowKey.toBuffer(), recipientWallet.publicKey.toBuffer()],
      program.programId
    )
    recipientKey = recipientPDA

    await program.methods.addRecipient(
      Array.from(escrowId),
      recipientWallet.publicKey,
      100 * 100 // 100%
    )
    .accounts({
      escrow: escrowKey,
      recipient: recipientKey,
      initializer: initializer.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([initializer])
    .rpc()
  })

  describe("when the escrow is started & one module is added (MinimunAmount)", () => {
    beforeEach(async () => {
      const [minimumAmountPDA, _] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from('minimum_amount'), escrowKey.toBuffer()],
        program.programId
      )
      minimumAmountKey = minimumAmountPDA

      // Add MinimumAmount of 2 SOL
      await program.methods.addMinimumAmount(
        Array.from(escrowId),
        new BN(2 * LAMPORTS_PER_SOL),
      )
      .accounts({
        escrow: escrowKey,
        minimumAmount: minimumAmountKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([initializer])
      .rpc();
  
      const minimumAmountAccount = await program.account.minimumAmount.fetch(minimumAmountKey);
      expect(minimumAmountAccount.minAmount.toNumber()).toBe(2 * LAMPORTS_PER_SOL);
  
      let escrowAccount = await program.account.escrow.fetch(escrowKey);
  
      expect(escrowAccount.modules).toHaveLength(1);

      await program.methods.startEscrow(
        Array.from(escrowId)
      )
      .accounts({
        escrow: escrowKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).signers([initializer])
      .rpc()

      escrowAccount = await program.account.escrow.fetch(escrowKey)
      expect(escrowAccount.status).toEqual({started: {}});
    })

    it("Successfully released an escrow with one module: MinimumAmount", async () => {
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

      await program.methods.releaseEscrow(
        Array.from(escrowId)
      ).accounts({
        escrow: escrowKey,
        initializer: initializer.publicKey,
      }).signers([initializer])
      .remainingAccounts([
        {
          pubkey: minimumAmountKey,
          isWritable: true,
          isSigner: false
        }
      ])
      .rpc()

      let escrowAccount = await program.account.escrow.fetch(escrowKey)
      expect(escrowAccount.status).toEqual({released: {}});
    })

    it("Fails when module condition is not met", async () => {
      await program.methods.depositEscrow(
        Array.from(escrowId),
        new BN(1.99 * LAMPORTS_PER_SOL)
      ).accounts(
        {
          escrow: escrowKey,
          depositor: depositorKey,
          signer: depositorWallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }
      ).signers([depositorWallet]).rpc()

      try {
        await program.methods.releaseEscrow(
          Array.from(escrowId)
        ).accounts({
          escrow: escrowKey,
          initializer: initializer.publicKey,
        }).signers([initializer]) 
        .remainingAccounts([
          {
            pubkey: minimumAmountKey,
            isWritable: true,
            isSigner: false
          }
        ])
      .rpc()

      throw new Error('Should not be able to release escrow since minimum amount is not met')
      } catch (error: any) {
        expect(error.toString()).toContain('Error Code: ValidationFailed')
        expect(error.toString()).toContain('Validation failed. The escrow is not released.')

        let escrowAccount = await program.account.escrow.fetch(escrowKey)
        expect(escrowAccount.status).toEqual({started: {}});
      }
    })

    it("Fails when not all modules are provided in remaining_accounts", async () => {
      try {
        await program.methods.releaseEscrow(
          Array.from(escrowId)
        ).accounts({
          escrow: escrowKey,
          initializer: initializer.publicKey,
        }).signers([initializer])
        .remainingAccounts([])
        .rpc()

        throw new Error('Should not be able to release escrow since minimum amount is not met')
      } catch (error: any) {
        expect(error.toString()).toContain('Error Code: InvalidNumberOfAccounts')
        expect(error.toString()).toContain('Error Message: Invalid number of accounts.')
      }
    })

    it("Fails when providing invalid module accounts", async () => {
      
    })

    it("Fails when module account has invalid owner", async () => {
      // Create a system-owned account (not owned by our program)
      const randomKeypair = Keypair.generate();
      const signature = await provider.connection.requestAirdrop(
        randomKeypair.publicKey,
        1 * LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(signature);
      
      try {
        await program.methods.releaseEscrow(
          Array.from(escrowId)
        ).accounts({
          escrow: escrowKey,
          initializer: initializer.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        }).signers([initializer])
        .remainingAccounts([
          {
            pubkey: randomKeypair.publicKey, // This key is owned by System Program, not our program
            isWritable: true,
            isSigner: false
          }
        ])
        .rpc();
        
        throw new Error('Should fail when account owner is not the program');
      } catch (error: any) {
        expect(error.toString()).toContain('Error Code: InvalidAccountOwner');
        expect(error.toString()).toContain('Account does not have the correct program id');
      }
    })
  })

  it("Fails when the escrow isn't Started", async () => {
    try {
      await program.methods.releaseEscrow(
        Array.from(escrowId)
      ).accounts({
        escrow: escrowKey,
        initializer: initializer.publicKey,
      }).signers([initializer])
      .rpc()

      throw new Error('Should fail when escrow is not started')
    } catch (error: any) {
      expect(error.toString()).toContain('Error Code: EscrowNotStarted')
      expect(error.toString()).toContain('Error Message: Escrow must be in Started status to modify it')
    }
  })  

  it("Fails when providing duplicated module accounts", async () => {
    // TODO: This test need to be implemented when multiple modules are ready
    //       I can't add multiple modules to test this. 
    //       Only the module: MinimumAmount is implemented and the module len vec will always be 1
  })

  describe("when the escrow is started & 2 modules are added (MinimumAmount, Timelock)", () => {
    beforeEach(async () => {
      const [minimumAmountPDA, _minimumAmountBump] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from('minimum_amount'), escrowKey.toBuffer()],
          program.programId
      )
      minimumAmountKey = minimumAmountPDA

      // Add MinimumAmount of 2 SOL
      await program.methods.addMinimumAmount(
          Array.from(escrowId),
          new BN(2 * LAMPORTS_PER_SOL),
      )
      .accounts({
        escrow: escrowKey,
        minimumAmount: minimumAmountKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([initializer])
      .rpc();

      const minimumAmountAccount = await program.account.minimumAmount.fetch(minimumAmountKey);
      expect(minimumAmountAccount.minAmount.toNumber()).toBe(2 * LAMPORTS_PER_SOL);

      const [timelockPDA, _] = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from('timelock'), escrowKey.toBuffer()],
          program.programId
      )

      timelockKey = timelockPDA
    })

    it("Successfully released an escrow with 2 modules: MinimumAmount, Timelock", async () => {
      const now = Math.floor(Date.now() / 1000) + 1

      await program.methods.addTimelock(
          Array.from(escrowId),
          new anchor.BN(now)
      )
      .accounts({
        escrow: escrowKey,
        timelock: timelockKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([initializer])
      .rpc();

      let escrowAccount = await program.account.escrow.fetch(escrowKey);
      expect(escrowAccount.modules).toHaveLength(2);

      const timelockAccount = await program.account.timelock.fetch(timelockKey);
      expect(timelockAccount.releaseAfter.toNumber()).toBe(now);

      await program.methods.startEscrow(
          Array.from(escrowId)
      )
      .accounts({
        escrow: escrowKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).signers([initializer])
      .rpc()

      escrowAccount = await program.account.escrow.fetch(escrowKey)
      expect(escrowAccount.status).toEqual({started: {}});

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

      // wait the timelock to be released
      await new Promise(resolve => setTimeout(resolve, 1000));

      await program.methods.releaseEscrow(
          Array.from(escrowId)
      ).accounts({
        escrow: escrowKey,
        initializer: initializer.publicKey,
      }).signers([initializer])
      .remainingAccounts([
        {
          pubkey: minimumAmountKey,
          isWritable: true,
          isSigner: false
        },
        {
          pubkey: timelockKey,
          isWritable: true,
          isSigner: false
        }
      ])
      .rpc()

      escrowAccount = await program.account.escrow.fetch(escrowKey)
      expect(escrowAccount.status).toEqual({released: {}});
    })

    it("Fails when one module condition is not met", async () => {
      const nowPlusOneday = Math.floor(Date.now() / 1000)  + 24 * 60 * 60

      await program.methods.addTimelock(
          Array.from(escrowId),
          new anchor.BN(nowPlusOneday)
      )
      .accounts({
        escrow: escrowKey,
        timelock: timelockKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([initializer])
      .rpc();

      let escrowAccount = await program.account.escrow.fetch(escrowKey);
      expect(escrowAccount.modules).toHaveLength(2);

      const timelockAccount = await program.account.timelock.fetch(timelockKey);
      expect(timelockAccount.releaseAfter.toNumber()).toBe(nowPlusOneday);

      await program.methods.startEscrow(
          Array.from(escrowId)
      )
      .accounts({
        escrow: escrowKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).signers([initializer])
      .rpc()

      escrowAccount = await program.account.escrow.fetch(escrowKey)
      expect(escrowAccount.status).toEqual({started: {}});

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

      try {
        await program.methods.releaseEscrow(
            Array.from(escrowId)
        ).accounts({
          escrow: escrowKey,
          initializer: initializer.publicKey,
        }).signers([initializer])
        .remainingAccounts([
          {
            pubkey: minimumAmountKey,
            isWritable: true,
            isSigner: false
          },
          {
            pubkey: timelockKey,
            isWritable: true,
            isSigner: false
          }
        ])
        .rpc()

        throw new Error('Should not be able to release escrow since minimum amount is not met')
      } catch (error: any) {
        expect(error.toString()).toContain('Error Code: ValidationFailed')
        expect(error.toString()).toContain('Validation failed. The escrow is not released.')

        let escrowAccount = await program.account.escrow.fetch(escrowKey)
        expect(escrowAccount.status).toEqual({started: {}});
      }
    })

    it("Fails when not all modules are provided in remaining_accounts", async () => {
      const now = Math.floor(Date.now() / 1000) + 1

      await program.methods.addTimelock(
          Array.from(escrowId),
          new anchor.BN(now)
      )
      .accounts({
        escrow: escrowKey,
        timelock: timelockKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([initializer])
      .rpc();

      let escrowAccount = await program.account.escrow.fetch(escrowKey);
      expect(escrowAccount.modules).toHaveLength(2);

      const timelockAccount = await program.account.timelock.fetch(timelockKey);
      expect(timelockAccount.releaseAfter.toNumber()).toBe(now);

      await program.methods.startEscrow(
          Array.from(escrowId)
      )
      .accounts({
        escrow: escrowKey,
        initializer: initializer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      }).signers([initializer])
      .rpc()

      escrowAccount = await program.account.escrow.fetch(escrowKey)
      expect(escrowAccount.status).toEqual({started: {}});

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

      try {
        await program.methods.releaseEscrow(
            Array.from(escrowId)
        ).accounts({
          escrow: escrowKey,
          initializer: initializer.publicKey,
        }).signers([initializer])
        .remainingAccounts([])
        .rpc()

        throw new Error('Should not be able to release escrow since minimum amount and timelock are not provided')
      } catch (error: any) {
        expect(error.toString()).toContain('Error Code: InvalidNumberOfAccounts')
        expect(error.toString()).toContain('Error Message: Invalid number of accounts.')
      }
    })
  })
})
