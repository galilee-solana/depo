use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct ExpiryFallback {
  pub refund_after: u64
}

impl ExpiryFallback {
  pub fn is_satisfied() {
    // TODO: Implement the logic to check if satisfied
  }
}
