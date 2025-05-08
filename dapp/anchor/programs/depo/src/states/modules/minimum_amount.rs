use anchor_lang::prelude::*;
use crate::errors::MinimumAmountErrors;
use crate::states::{Escrow};

#[account]
#[derive(InitSpace)]
pub struct MinimumAmount {
  pub min_amount: u64   
}

impl MinimumAmount {
  pub fn is_satisfied(&self, escrow: &Escrow) -> Result<()>{

    require!(
            escrow.deposited_amount >= self.min_amount,
            MinimumAmountErrors::InsufficientAmount
        );

    Ok(())
  }
}