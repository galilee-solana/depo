use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Recipient {
  pub escrow: Pubkey,
  pub wallet: Pubkey,
  pub percentage: u16, // percentage * 100. Ex: 5,55% = 555
  pub has_withdrawn: bool
}