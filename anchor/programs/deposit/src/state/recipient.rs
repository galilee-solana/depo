use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Recipient {
  pub escrow: Pubkey,
  pub wallet: Pubkey,
  pub amount: u64,
  pub has_withdrawn: bool
}