use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Depositor {
  pub escrow: Pubkey,     // 32 bytes
  pub wallet: Pubkey,     // 32 bytes
  pub amount: u64,        // 8 bytes
  pub was_refunded: bool  // 1 byte
}
