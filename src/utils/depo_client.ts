import { PublicKey, Connection, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Depo } from "../../anchor/target/types/depo";
import { v4 as uuidv4 } from "uuid";
import Escrow from "./models/escrow";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Import the IDL directly with require to avoid TypeScript issues
const idl = require("../../anchor/target/idl/depo.json");

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



  /**
   * Create a new escrow
   * @param name - The name of the escrow
   * @param description - The description of the escrow
   * @returns The Escrow object
   */
  async createEscrow(name: string, description: string, ) {
    const uuid = uuidv4().replace(/-/g, '')
    const { key: escrowKey, bufferId: escrowId } = this.getPdaKeyAndBufferId(uuid)
    console.log("Creating escrow with UUID:", uuid);
    console.log("Escrow PDA Key:", escrowKey.toString());

    // Escrow Name (100 bytes) - will be truncated if too long
    const nameBuffer = Buffer.alloc(100)
    nameBuffer.write(name)

    // Escrow Description (200 bytes) - will be truncated if too long
    const descriptionBuffer = Buffer.alloc(200)
    descriptionBuffer.write(description)

    try {
      if (this.wallet.publicKey) {
        const tx = await this.program.methods.createEscrow(
          Array.from(escrowId),
          nameBuffer,
          descriptionBuffer
        ).accounts({
          escrow: escrowKey,
          signer: this.wallet.publicKey!,
          systemProgram: SystemProgram.programId,
        } as any)
        .rpc()
  
        // Wait for confirmation
        await this.program.provider.connection.confirmTransaction(tx);
        console.log("Transaction confirmed:", tx);
        
        // Verify account was created
        const accountInfo = await this.program.provider.connection.getAccountInfo(escrowKey);
        console.log("Account created:", !!accountInfo);
        
        if (!accountInfo) {
          throw new Error("Failed to create escrow account");
        }
        
        const escrowAccount = await this.program.account.escrow.fetch(escrowKey);
        const escrow = new Escrow(escrowAccount);
        console.log("Escrow created successfully:", escrow);
        return {
          tx: tx,
          escrow: escrow
        };
      } else {
        throw new Error("Wallet is not available");
      }
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

      // TODO: Fetch Recipients & Depositors
      // TODO: Fetch Conditions modules

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
}

export default DepoClient