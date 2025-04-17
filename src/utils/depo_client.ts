import { PublicKey, Connection, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, Program, Wallet } from "@coral-xyz/anchor";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { Depo } from "../../anchor/target/types/depo";
import { v4 as uuidv4 } from "uuid";
import Escrow from "./models/escrow";

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
  getPdaKey(uuid: string) {
    const escrowId = Uint8Array.from(Buffer.from(uuid, 'hex'))
    return PublicKey.findProgramAddressSync(
      [Buffer.from('escrow'), escrowId],
      this.program.programId
    )[0]
  }

  /**
   * Create a new escrow
   * @param name - The name of the escrow
   * @param description - The description of the escrow
   * @returns The Escrow object
   */
  async createEscrow(name: string, description: string) {
    const uuid = uuidv4().replace(/-/g, '')
    const escrowId = Uint8Array.from(Buffer.from(uuid, 'hex'))
    const escrowKey = this.getPdaKey(uuid)

    // Escrow Name (100 bytes) - will be truncated if too long
    const nameBuffer = Buffer.alloc(100)
    nameBuffer.write(name)

    // Escrow Description (200 bytes) - will be truncated if too long
    const descriptionBuffer = Buffer.alloc(200)
    descriptionBuffer.write(description)

    try {
      if (this.wallet.publicKey) {
        await this.program.methods.createEscrow(
          Array.from(escrowId),
          nameBuffer,
          descriptionBuffer
        ).accounts({
          escrow: escrowKey,
          signer: this.wallet.publicKey!,
          systemProgram: SystemProgram.programId,
        } as any)
        .rpc()
  
        const escrowAccount = await this.program.account.escrow.fetch(escrowKey);
        const escrow = new Escrow(escrowAccount);
        console.log("Escrow:", escrow);
        return escrow;
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
      const escrowKey = this.getPdaKey(id)
    
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
      return null;
    }
  }

  /**
   * Get all escrows
   * @returns The list of Escrow objects
   */
  async getEscrows() {
    try {
      const escrows = await this.program.account.escrow.all();
      console.log("Escrows:", escrows);
      return escrows.map(escrow => new Escrow(escrow.account));
    } catch (error: any) {
      console.error("Error fetching escrows:", error);
      return [];
    }
  }
}

export default DepoClient