import { PublicKey, Connection, SystemProgram, Transaction } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Depo } from "../../../anchor/target/types/depo";
import { v4 as uuidv4 } from "uuid";
import Escrow from "./models/escrow";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { BN } from "@coral-xyz/anchor";
import { solToBN, lamportsToSol } from '@/utils/number-formatter';

// Import the IDL directly with require to avoid TypeScript issues
const idl = require("../../../anchor/target/idl/depo.json");

class DepoClient {
  private program: Program<Depo>;
  private wallet: WalletContextState;

  constructor(provider: AnchorProvider, wallet: WalletContextState) {
    this.program = new Program(idl, provider);
    this.wallet = wallet;
  }

  /**
   * Get the PDA key for the escrow
   * @param uuid - The UUID of the escrow
   * @returns Key of the PDA
   */
  getPdaKeyAndBufferId(uuid: string) {
    const escrowId = Uint8Array.from(Buffer.from(uuid, 'hex'))
    const key = PublicKey.findProgramAddressSync(
      [Buffer.from('escrow'), escrowId],
      this.program.programId
    )[0]
    return {
      key: key,
      bufferId: escrowId
    }
  }

  getPdaKeyForRecipient(escrowKey: PublicKey, key: PublicKey) {
    const recipientKey = PublicKey.findProgramAddressSync(
      [Buffer.from('recipient'), escrowKey.toBuffer(), key.toBuffer()],
      this.program.programId
    )[0]
    return recipientKey
  }

  getPdaKeyForDepositor(escrowKey: PublicKey, key: PublicKey) {
    const depositorKey = PublicKey.findProgramAddressSync(
      [Buffer.from('depositor'), escrowKey.toBuffer(), key.toBuffer()],
      this.program.programId
    )[0]
    return depositorKey
  }

  getPdaKeyForTimelock(escrowKey: PublicKey) {
    const timelockKey = PublicKey.findProgramAddressSync(
      [Buffer.from('timelock'), escrowKey.toBuffer()],
      this.program.programId
    )[0]
    return timelockKey
  }

  getPdaKeyForMinimumAmount(escrowKey: PublicKey) {
    const minimumAmountKey = PublicKey.findProgramAddressSync(
      [Buffer.from('minimum_amount'), escrowKey.toBuffer()],
      this.program.programId
    )[0]
    return minimumAmountKey
  }

  getPdaKeyForTargetAmount(escrowKey: PublicKey) {
    const targetAmountKey = PublicKey.findProgramAddressSync(
      [Buffer.from('target_amount'), escrowKey.toBuffer()],
      this.program.programId
    )[0]
    return targetAmountKey
  }

  /**
   * Create a new escrow
   * @param name - The name of the escrow
   * @param description - The description of the escrow
   * @param timelock - The timelock of the escrow
   * @param minimumAmount - The minimum amount of the escrow
   * @param targetAmount - The target amount of the escrow
   * @param recipients - The recipients of the escrow
   * @param depositors - The depositors of the escrow
   * @returns The Escrow object
   */
  async createEscrow(name: string, description: string, timelock: string, minimumAmount: string, targetAmount: string, recipients: string[], depositors: string[]) {
    const uuid = uuidv4().replace(/-/g, '')
    const { key: escrowKey, bufferId: escrowId } = this.getPdaKeyAndBufferId(uuid)

    // Escrow Name (100 bytes) - will be truncated if too long
    const nameBuffer = Buffer.alloc(100)
    nameBuffer.write(name)

    // Escrow Description (200 bytes) - will be truncated if too long
    const descriptionBuffer = Buffer.alloc(200)
    descriptionBuffer.write(description)

    try {
      if (!this.wallet.publicKey) {
        throw new Error("Wallet is not available");
      }   

    
      const createTx = await this.program.methods.createEscrow(
        Array.from(escrowId),
        nameBuffer,
        descriptionBuffer
      ).accounts({
        escrow: escrowKey,
        signer: this.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      } as any).rpc();
      
      await this.program.provider.connection.confirmTransaction(createTx, 'confirmed');

      let escrowAccount = await this.program.account.escrow.fetch(escrowKey);
      
      // Add recipients if needed
      if (recipients.length > 0) {
        const equalShareBasisPoints = Math.floor(10000 / recipients.length);
      
        for (const recipient of recipients) {
          try {
            const recipientWallet = new PublicKey(recipient);
            const recipientKey = this.getPdaKeyForRecipient(escrowKey, recipientWallet);
            
            const recipientTx = await this.program.methods.addRecipient(
              Array.from(escrowId),
              recipientWallet,
              equalShareBasisPoints
            ).accounts({
              escrow: escrowKey,
              recipient: recipientKey,
              initializer: this.wallet.publicKey,
              systemProgram: SystemProgram.programId,
            } as any).rpc();
            
            await this.program.provider.connection.confirmTransaction(recipientTx, 'confirmed');
          } catch (e) {
            console.error(`Error adding recipient ${recipient}:`, e);
            // Continue with other recipients
          }
        }

        // Add depositors if needed
        if (depositors.length > 0) {
          for (const depositor of depositors) {   
            if (depositor == "") {
              continue;
            }
            try {
              const depositorWallet = new PublicKey(depositor);
              const depositorKey = this.getPdaKeyForDepositor(escrowKey, depositorWallet);
              
              const depositorTx = await this.program.methods.addDepositor(
                Array.from(escrowId),
                depositorWallet
              ).accounts({
                escrow: escrowKey,
                depositor: depositorKey,
                initializer: this.wallet.publicKey,
                systemProgram: SystemProgram.programId,
              } as any).rpc();
            
              await this.program.provider.connection.confirmTransaction(depositorTx, 'confirmed');
            } catch (e) {
              console.error(`Error adding depositor ${depositor}:`, e);
              // Continue with other depositors
            }
          }
        }

        // Add timelock if needed
        if (timelock !== "") {
          const timestamp = new Date(timelock).getTime().toString()
          const timelockKey = this.getPdaKeyForTimelock(escrowKey);
          const timelockTx = await this.program.methods.addTimelock(
            Array.from(escrowId),
            new BN(timestamp)
          ).accounts({
            escrow: escrowKey,
            timelock: timelockKey,
            initializer: this.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          } as any).rpc();  

          await this.program.provider.connection.confirmTransaction(timelockTx, 'confirmed');
        }

        // Add minimum amount if needed
        if (minimumAmount !== "") {
          const minimumAmountKey = this.getPdaKeyForMinimumAmount(escrowKey);
          // Use our utility for correct conversion
          const minimumAmountBN = solToBN(minimumAmount) || new BN(0);
          
          const minimumAmountTx = await this.program.methods.addMinimumAmount(
            Array.from(escrowId),
            minimumAmountBN
          ).accounts({  
            escrow: escrowKey,
            minimumAmount: minimumAmountKey,
            initializer: this.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          } as any).rpc();

          await this.program.provider.connection.confirmTransaction(minimumAmountTx, 'confirmed');
        }

        // Add target amount if needed
        if (targetAmount !== "") {
          const targetAmountKey = this.getPdaKeyForTargetAmount(escrowKey);
          // Use our utility for correct conversion
          const targetAmountBN = solToBN(targetAmount) || new BN(0);
          
          const targetAmountTx = await this.program.methods.addTargetAmount(
            Array.from(escrowId),
            targetAmountBN
          ).accounts({
            escrow: escrowKey,
            targetAmount: targetAmountKey,
            initializer: this.wallet.publicKey,
            systemProgram: SystemProgram.programId,
          } as any).rpc();

          await this.program.provider.connection.confirmTransaction(targetAmountTx, 'confirmed');
        }

        // Refresh escrow data
        escrowAccount = await this.program.account.escrow.fetch(escrowKey);
      }
      
      const escrow = new Escrow(escrowAccount);
      
      return {
        tx: createTx,
        escrow: escrow
      };
    } catch (error) {
      console.error("Error creating escrow:", error);
      throw error;
    }
  }

  /**
   * Get an escrow by its UUID
   * @param uuid - The UUID of the escrow
   * @returns The Escrow object or null if not found
   */
  async getEscrow(uuid: string) {
    try {
      const id = uuid.replace(/-/g, '')
      const { key: escrowKey } = this.getPdaKeyAndBufferId(id)
    
      // First check if account exists to avoid the error
      const accountInfo = await this.program.provider.connection.getAccountInfo(escrowKey);
      if (!accountInfo) {
        return null;
      }
      
      const escrowAccount = await this.program.account.escrow.fetch(escrowKey);
      const escrow = new Escrow(escrowAccount);

      const recipients = await this.program.account.recipient.all([
        {
          memcmp: {
            offset: 8, // Skip the 8-byte discriminator
            bytes: bs58.encode(escrowKey.toBuffer())
          }
        }
      ]);

      const depositors = await this.program.account.depositor.all([
        {
          memcmp: {
            offset: 8, // Skip the 8-byte discriminator
            bytes: bs58.encode(escrowKey.toBuffer())
          }
        }
      ]);

      escrow.recipients = recipients;
      escrow.depositors = depositors;

      return escrow;
    } catch (error: any) {
      console.error(`Error fetching escrow #${uuid}:`, error);
      throw error;
    }
  }

  /**
   * Get all escrows
   * @returns The list of Escrow objects
   */
  async getAllEscrows() {
    try {
      const escrows = await this.program.account.escrow.all([
        {
          memcmp: {
            offset: 24, // 8 (discriminator) + 16 (id field)
            bytes: bs58.encode(this.wallet.publicKey!.toBuffer())
          }
        }
      ]);
    
      return escrows.map(escrow => new Escrow(escrow.account));
    } catch (error: any) {
      throw error;
    }
  }

  async deleteDraftEscrow(uuid: string) {
    const cleanUuid = uuid.replace(/-/g, '')
    try {
      const { key: escrowKey, bufferId: escrowId } = this.getPdaKeyAndBufferId(cleanUuid)
      
      const accountInfo = await this.program.provider.connection.getAccountInfo(escrowKey);
      
      if (!accountInfo) {
        throw new Error("Escrow account doesn't exist or has already been deleted");
      }
      
      const tx = await this.program.methods.deleteDraftEscrow(
        Array.from(escrowId),
      ).accounts({
        escrow: escrowKey,
        initializer: this.wallet.publicKey!,
        systemProgram: SystemProgram.programId,
      }).rpc()
      
      await this.program.provider.connection.confirmTransaction(tx);
      return tx
    } catch (error) {
      throw error;
    }
  }

  async startEscrow(uuid: string) {
    const cleanUuid = uuid.replace(/-/g, '')
    try {
      const { key: escrowKey, bufferId: escrowId } = this.getPdaKeyAndBufferId(cleanUuid)

      const tx = await this.program.methods.startEscrow(
        Array.from(escrowId),
      ).accounts({
        escrow: escrowKey,
        initializer: this.wallet.publicKey!,
        systemProgram: SystemProgram.programId,
      }).rpc()

      await this.program.provider.connection.confirmTransaction(tx);
      return tx
    } catch (error) {
      throw error;
    }
  }

  async addRecipient(uuid: string, key: string, percentage: number) {
    const cleanUuid = uuid.replace(/-/g, '')
    const { key: escrowKey, bufferId: escrowId } = this.getPdaKeyAndBufferId(cleanUuid)
    const recipientWallet = new PublicKey(key)
    const recipientKey = this.getPdaKeyForRecipient(escrowKey, recipientWallet)

    const convertedPercentage = percentage * 100;

    try {
      const tx = await this.program.methods.addRecipient(
        Array.from(escrowId),
        recipientWallet,
        convertedPercentage
      ).accounts({
        escrow: escrowKey,
        recipient: recipientKey,
        initializer: this.wallet.publicKey!,
        systemProgram: SystemProgram.programId,
      }).rpc()

      await this.program.provider.connection.confirmTransaction(tx);
      return tx
    } catch (error) {
      throw error;
    }
  }

  async depositEscrow(uuid: string, amount: BN) {
    const cleanUuid = uuid.replace(/-/g, '')
    const { key: escrowKey, bufferId: escrowId } = this.getPdaKeyAndBufferId(cleanUuid)

    const depositorKey = this.getPdaKeyForDepositor(escrowKey, this.wallet.publicKey!)

    try {
      // Check wallet balance before attempting transaction
      const balance = await this.program.provider.connection.getBalance(this.wallet.publicKey!);
      if (balance < amount.toNumber()) {
        throw new Error("Insufficient balance.");
      }

      const tx = await this.program.methods.depositEscrow(
        Array.from(escrowId),
        amount
      ).accounts({
        escrow: escrowKey,
        depositor: depositorKey,
        signer: this.wallet.publicKey!,
        systemProgram: SystemProgram.programId,
      } as any).rpc()

      await this.program.provider.connection.confirmTransaction(tx);

      return tx
    } catch (error) {
      console.error("Error depositing escrow:", error);
      throw error;
    }
  }

  async cancelEscrow(uuid: string) {
    const cleanUuid = uuid.replace(/-/g, '')
    const { key: escrowKey, bufferId: escrowId } = this.getPdaKeyAndBufferId(cleanUuid)

    try {
      const tx = await this.program.methods.cancelEscrow(
        Array.from(escrowId),
      ).accounts({
        escrow: escrowKey,
        initializer: this.wallet.publicKey!,
        systemProgram: SystemProgram.programId,
      }).rpc()

      await this.program.provider.connection.confirmTransaction(tx);
      return tx
    } catch (error) {
      throw error;
    }
  }

  async releaseEscrow(uuid: string) {
    const cleanUuid = uuid.replace(/-/g, '')
    const { key: escrowKey, bufferId: escrowId } = this.getPdaKeyAndBufferId(cleanUuid)

    try {
      const tx = await this.program.methods.releaseEscrow(
        Array.from(escrowId),
      ).accounts({
        escrow: escrowKey,
        initializer: this.wallet.publicKey!,
        systemProgram: SystemProgram.programId,
      })
      .remainingAccounts([])
      .rpc()

      await this.program.provider.connection.confirmTransaction(tx);
      return tx
    } catch (error) {
      throw error;
    }
  }

  async claimRefund(uuid: string) {
    const cleanUuid = uuid.replace(/-/g, '')
    const { key: escrowKey, bufferId: escrowId } = this.getPdaKeyAndBufferId(cleanUuid)

    const depositorKey = this.getPdaKeyForDepositor(escrowKey, this.wallet.publicKey!)

    try {
      const tx = await this.program.methods.refundDepositor(
        Array.from(escrowId),
      ).accounts({
        escrow: escrowKey,
        depositor: depositorKey,
        signer: this.wallet.publicKey!,
        systemProgram: SystemProgram.programId,
      } as any).rpc()

      await this.program.provider.connection.confirmTransaction(tx);
      return tx
    } catch (error) {
      throw error;
    }
  }

  async withdrawEscrow(uuid: string) {
    const cleanUuid = uuid.replace(/-/g, '')
    const { key: escrowKey, bufferId: escrowId } = this.getPdaKeyAndBufferId(cleanUuid)

    const recipientKey = this.getPdaKeyForRecipient(escrowKey, this.wallet.publicKey!)

    try {
      const tx = await this.program.methods.withdrawEscrow(
        Array.from(escrowId),
      ).accounts({
        escrow: escrowKey,
        recipient: recipientKey,
        signer: this.wallet.publicKey!,
        systemProgram: SystemProgram.programId, 
      } as any).rpc()

      await this.program.provider.connection.confirmTransaction(tx);
      return tx
    } catch (error) {
      throw error;
    }
  }
}

export default DepoClient