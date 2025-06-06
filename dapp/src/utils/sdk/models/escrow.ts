import { stringify as uuidStringify } from 'uuid';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { EscrowStatus } from './escrowStatus';
import { lamportsToSol } from '@/utils/number-formatter';
import { formatTimestamp } from '@/utils/timestamp-formatter';

/**
 * Escrow model
 * 
 * @param uuid - The UUID of the escrow
 * @param name - The name
 * @param description - The description
 * @param createdAt - The date and time the escrow was created
 * @param initializer - The public key of the initializer
 * @param depositedAmount - The amount deposited
 * @param isPublicDeposit - Whether the escrow allows public deposits
 * @param depositorsCount - The number of depositors
 * @param recipientsCount - The number of recipients
 * @param remainingPercentage - The remaining percentage
 * @param withdrawnAmount - The amount withdrawn
 * @param status - The status of the escrow
 * @param recipients - The recipients of the escrow
 * @param depositors - The depositors of the escrow
 */
class Escrow {
  uuid: string;
  name: string;
  description: string;
  initializer: PublicKey;
  
  depositedAmount: string;
  withdrawnAmount: string;
  
  createdAt: BN;
  createdAtFormatted: string;
  isPublicDeposit: boolean;
  depositorsCount: number;
  recipientsCount: number;
  remainingPercentage: number;
  status: EscrowStatus;
  modules: any[];
  recipients: any[];
  depositors: any[];
  timelock: any | null;
  minimumAmount: any | null;
  targetAmount: any | null;

  constructor(escrow: any) {
    // Convert id (byte array) to uuid string
    this.uuid = uuidStringify(escrow.id);
    
    // Convert name and description from byte arrays to strings
    this.name = this.byteArrayToString(escrow.name);
    this.description = this.byteArrayToString(escrow.description);
    
    // Set the initializer public key
    this.initializer = escrow.initializer;
    
    // Set BN values
    this.depositedAmount = lamportsToSol(escrow.depositedAmount);

    this.withdrawnAmount = lamportsToSol(escrow.withdrawnAmount);
    this.createdAt = escrow.createdAt;
    
    // Create formatted date string
    this.createdAtFormatted = formatTimestamp(escrow.createdAt);
    
    // Set other properties
    this.isPublicDeposit = escrow.isPublicDeposit;
    this.depositorsCount = escrow.depositorsCount;
    this.recipientsCount = escrow.recipientsCount;
    this.remainingPercentage = escrow.remainingPercentage;

    this.recipients = escrow.recipients;
    this.depositors = escrow.depositors;

    // Handle the status enum from Anchor properly
    this.status = this.parseStatusEnum(escrow.status);
    
    this.modules = escrow.modules || [];

    this.timelock = escrow.timelock || null;
    this.minimumAmount = escrow.minimumAmount || null;
    this.targetAmount = escrow.targetAmount || null;
  }

  /**
   * Convert a byte array to a string, stopping at the first null character
   */
  private byteArrayToString(byteArray: number[]): string {
    if (!byteArray || !byteArray.length) return '';
    
    // Find the first null byte (0) or use the entire array
    const nullIndex = byteArray.indexOf(0);
    const length = nullIndex >= 0 ? nullIndex : byteArray.length;
    
    // Convert the bytes to a string
    return String.fromCharCode(...byteArray.slice(0, length));
  }

  /**
   * Parse the Anchor enum format into our TypeScript enum
   */
  private parseStatusEnum(statusObj: any): EscrowStatus {
    // Anchor enums come as objects with a single key matching the variant name
    // e.g., { draft: {} } or { started: {} }
    if (statusObj?.draft !== undefined) return EscrowStatus.DRAFT;
    if (statusObj?.started !== undefined) return EscrowStatus.STARTED;
    if (statusObj?.released !== undefined) return EscrowStatus.RELEASED;
    if (statusObj?.cancelled !== undefined) return EscrowStatus.CANCELLED;
    if (statusObj?.expired !== undefined) return EscrowStatus.EXPIRED;
    
    // Default fallback
    return EscrowStatus.DRAFT;
  }

  setTimelock(timelock: any) {
    this.timelock = {
      account: timelock
    };
  }

  setMinimumAmount(minimumAmount: any) {
    this.minimumAmount = {
      account: minimumAmount
    };
  }

  setTargetAmount(targetAmount: any) {
    this.targetAmount = {
      account: targetAmount
    };
  }

  setDepositors(depositors: any[]) {
    this.depositors = depositors;
  }

  setRecipients(recipients: any[]) {
    this.recipients = recipients;
  } 
  
  /**
   * Check if escrow is in draft status
   */
  isDraft(): boolean {
    return this.status === EscrowStatus.DRAFT;
  }
  
  /**
   * Check if escrow is in started status
   */
  isStarted(): boolean {
    return this.status === EscrowStatus.STARTED;
  }
  
  /**
   * Check if escrow is in released status
   */
  isReleased(): boolean {
    return this.status === EscrowStatus.RELEASED;
  }
}

export default Escrow;
