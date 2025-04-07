use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Depositor {
  pub escrow: Pubkey,
  pub wallet: Pubkey,
  pub amount: u64,
  pub was_refunded: bool
}