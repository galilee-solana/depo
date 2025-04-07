use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct MinimumAmount {
  pub min_amount: u64   
}

impl MinimumAmount {
  pub fn is_satisfied() {
    // TODO: Implement the logic to check if satisfied
  }
}