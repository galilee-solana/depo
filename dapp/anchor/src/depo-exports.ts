// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import DepositIDL from '../target/idl/depo.json'
import type { Depo } from '../target/types/depo'

// Re-export the generated IDL and type
export { Depo, DepositIDL }

// The programId is imported from the program IDL.
export const DEPOSIT_PROGRAM_ID = new PublicKey(DepositIDL.address)

// This is a helper function to get the Depo Anchor program.
export function getDepositProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...DepositIDL, address: address ? address.toBase58() : DepositIDL.address } as Depo, provider)
}

// This is a helper function to get the program ID for the Depo program depending on the cluster.
export function getDepositProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Depo program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return DEPOSIT_PROGRAM_ID
  }
}
