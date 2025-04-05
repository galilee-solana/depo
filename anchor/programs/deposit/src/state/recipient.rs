use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Recipient {
  pub escrow: Pubkey,     // 32 bytes
  pub wallet: Pubkey,     // 32 bytes
  pub amount: u64,        // 8 bytes
  pub has_withdrawn: bool // 1 byte
}