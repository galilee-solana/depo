use anchor_lang::prelude::*;

// TODO: Calculate the size of the account
//       based on the number of signers and approvals

#[account]
pub struct MultisigApproval {
  pub signers: Vec<Pubkey>,
  pub approvals: Vec<Pubkey>,
  pub threshold: u8,
}

impl MultisigApproval {
  pub fn is_satisfied() {
    // TODO: Implement the logic to check if satisfied
  }
}