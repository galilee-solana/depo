import { PublicKey } from "@solana/web3.js";

export function validatePubkey(address: string): boolean {
  try {
    new PublicKey(address)
    return true
  } catch {
    return false
  }
}