use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct SingleApproval {
  pub signer: Pubkey,
  pub approved: bool,
}

impl SingleApproval {
  pub fn is_satisfied() {
    // TODO: Implement the logic to check if satisfied
  }
}
