use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct TargetAmount {
  pub target_amount: u64,
}

// impl TargetAmount {
//   pub fn is_satisfied() {
//     // TODO: Implement the logic to check if satisfied
//   }
// }