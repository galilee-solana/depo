use anchor_lang::prelude::*;
use crate::errors::TargetAmountErrors;
use crate::states::Escrow;

#[account]
#[derive(InitSpace)]
pub struct TargetAmount {
  pub target_amount: u64,
}

impl TargetAmount {
  pub fn is_satisfied(&self, escrow: &Escrow) -> Result<()>{

    require!(
            escrow.deposited_amount == self.target_amount,
            TargetAmountErrors::AmountNotReached
        );

    Ok(())
  }
}