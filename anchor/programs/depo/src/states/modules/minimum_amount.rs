use anchor_lang::prelude::*;
use crate::errors::MinimumAmountErrors;
use crate::states::modules::condition::ConditionModule;
use crate::states::EscrowContext;

#[account]
#[derive(InitSpace)]
pub struct MinimumAmount {
  pub min_amount: u64   
}

impl ConditionModule for MinimumAmount {
  fn is_satisfied(&self, escrow_account: &dyn EscrowContext) -> Result<()>{
    let escrow_balance = escrow_account.lamports();

    require!(
            escrow_balance >= self.min_amount,
            MinimumAmountErrors::InsufficientAmount
        );

    Ok(())
  }
}

#[cfg(test)]
mod tests {
    use crate::utils::test_helpers::mocks::MockEscrow;
    use super::*;
    
    #[test]
    fn test_is_satisfied_pass() {
       let escrow = &MockEscrow{balance: 1000};
        let min_amount_accounbt = &MinimumAmount {min_amount: 100};
        
        assert!(min_amount_accounbt.is_satisfied(escrow).is_ok());
    }
    
    #[test]
    fn test_is_satisfied_fail() {
        let escrow = &MockEscrow{balance: 1000};
        let min_amount_account = &MinimumAmount {min_amount: 10000};
        
        assert!(min_amount_account.is_satisfied(escrow).is_err());
    }
}