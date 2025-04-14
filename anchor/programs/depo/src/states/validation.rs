use crate::states::Escrow;
use crate::states::modules::ConditionModule;
use anchor_lang::prelude::*;

use anyhow::Result;

pub trait EscrowContext {
    fn lamports(&self) -> u64;
}

impl EscrowContext for Account<'_, Escrow> {
    fn lamports(&self) -> u64 {
        **self.to_account_info().lamports.borrow()
    }
}


/// Validates escrow modules conditions
///  
/// # Arguments
/// * `escrow` - The escrow account
/// * `modules` - a slice of ModuleCondition to validate
///
/// # Returns
/// * `Result<()>` - Result indicating conditions validation success or failure
pub fn validate_module_conditions(
    escrow: &dyn EscrowContext,
    modules: &[ConditionModule]
) -> Result<()> {
    let mut errors = Vec::new();

    for module in modules {
        if let Err(err) = module.is_satisfied(escrow) {
            errors.push(format!("Error in module: {}", err));
        }
    }

    if !errors.is_empty() {
        return Err(anyhow::anyhow!("Validation errors: {:?}", errors));
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use crate::utils::test_helpers::mocks::MockEscrow;
    use crate::states::MinimumAmount;
    use crate::errors::MinimumAmountErrors;
    use crate::states::modules::ConditionModuleTrait;
    use super::*;
    
    #[error_code]
    pub enum MyConditionErrors {
        #[msg("Always fails for testing")]
        AlwaysFails,
    }
    
    struct AlwaysPass;
    impl ConditionModuleTrait for AlwaysPass {
        fn is_satisfied(&self, _escrow: &dyn EscrowContext) -> anchor_lang::Result<()> {
            Ok(())
        }
    }

    struct AlwaysFail;
    impl ConditionModuleTrait for AlwaysFail {
        fn is_satisfied(&self, _escrow: &dyn EscrowContext) -> anchor_lang::Result<()> {
            err!(MyConditionErrors::AlwaysFails) 
        }
    }

    enum TestModuleCondition {
        MinimumAmount(MinimumAmount),
    }
    
    impl TestModuleCondition {
        fn is_satisfied(&self, escrow_account: &dyn EscrowContext) -> anchor_lang::Result<()> {
            match self {
                TestModuleCondition::MinimumAmount(module) => {
                    let escrow_balance = escrow_account.lamports();
                    require!(
                        escrow_balance >= module.min_amount,
                        MinimumAmountErrors::InsufficientAmount
                    );
                    Ok(())
                }
            }
        }
    }
    
    // Add new tests for the enum-based approach
    #[test]
    fn test_enum_minimum_amount_pass() {
        let escrow = &MockEscrow{balance: 1000};
        let min_amount = MinimumAmount { min_amount: 500 };
        let module_condition = TestModuleCondition::MinimumAmount(min_amount);

        assert!(module_condition.is_satisfied(escrow).is_ok());
    }
    
    #[test]
    fn test_enum_minimum_amount_fail() {
        let escrow = &MockEscrow{balance: 1000};
        let min_amount = MinimumAmount { min_amount: 2000 };
        let module_condition = TestModuleCondition::MinimumAmount(min_amount);
        
        assert!(module_condition.is_satisfied(escrow).is_err());
    }
}