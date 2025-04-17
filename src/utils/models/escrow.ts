import { stringify as uuidStringify } from 'uuid';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { EscrowStatus, parseAnchorEnum } from '../anchor-enums';

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
 */
class Escrow {
  uuid: string;
  name: string;
  description: string;
  initializer: PublicKey;
  
  depositedAmount: BN;
  withdrawnAmount: BN;
  
  createdAt: BN;
  isPublicDeposit: boolean;
  depositorsCount: number;
  recipientsCount: number;
  remainingPercentage: number;
  status: EscrowStatus;
  modules: any[];

  constructor(escrow: any) {
    // Convert id (byte array) to uuid string
    this.uuid = uuidStringify(escrow.id);
    
    // Convert name and description from byte arrays to strings
    this.name = this.byteArrayToString(escrow.name);
    this.description = this.byteArrayToString(escrow.description);
    
    // Set the initializer public key
    this.initializer = escrow.initializer;
    
    // Set BN values
    this.depositedAmount = escrow.depositedAmount;
    this.withdrawnAmount = escrow.withdrawnAmount;
    this.createdAt = escrow.createdAt;
    
    // Set other properties
    this.isPublicDeposit = escrow.isPublicDeposit;
    this.depositorsCount = escrow.depositorsCount;
    this.recipientsCount = escrow.recipientsCount;
    this.remainingPercentage = escrow.remainingPercentage;
    
    // Parse the status enum using our utility function
    this.status = parseAnchorEnum(escrow.status, EscrowStatus, EscrowStatus.DRAFT) as EscrowStatus;
    
    this.modules = escrow.modules || [];
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
