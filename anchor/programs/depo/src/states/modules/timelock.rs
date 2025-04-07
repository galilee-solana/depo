use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Timelock {
  // Unix timestamp
  pub release_after: u64,
}

impl Timelock {
  pub fn is_satisfied() {
    // TODO: Implement the logic to check if satisfied
  }
}