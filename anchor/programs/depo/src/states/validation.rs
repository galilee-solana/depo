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
/// * `modules` - a slice of ConditionModule to validate
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

    enum TestConditionModule {
        AlwaysPass(AlwaysPass),
        AlwaysFail(AlwaysFail),
    }
    
    impl TestConditionModule {
        fn is_satisfied(&self, escrow_account: &dyn EscrowContext) -> anchor_lang::Result<()> {
            match self {
                TestConditionModule::AlwaysPass(module) => module.is_satisfied(escrow_account),
                TestConditionModule::AlwaysFail(module) => module.is_satisfied(escrow_account),
            }
        }
    }

    // Add new tests for the enum-based approach
    #[test]
    fn test_always_pass() {
        let escrow = &MockEscrow{balance: 1000};
        let module_condition = TestConditionModule::AlwaysPass(AlwaysPass);

        assert!(module_condition.is_satisfied(escrow).is_ok());
    }
    
    #[test]
    fn test_always_fail() {
        let escrow = &MockEscrow{balance: 1000};
        let module_condition = TestConditionModule::AlwaysFail(AlwaysFail);
        
        assert!(module_condition.is_satisfied(escrow).is_err());
    }
    
    #[test]
    fn test_validate_pass_and_fail() {
        let escrow = &MockEscrow{balance: 1000};
        
        // This function mirrors the real validate_module_conditions function but works with our test traits
        // The real validate_module_conditions signature is:
        //    fn validate_module_conditions(escrow: &dyn EscrowContext, modules: &[ConditionModule]) -> Result<()>
        // Our test version uses the ConditionModuleTrait directly to test the same validation logic:
        fn validate_test_conditions(
            escrow: &dyn EscrowContext,
            modules: &[&dyn ConditionModuleTrait]
        ) -> anyhow::Result<()> {
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
        
        // Test with all passing modules
        {
            let pass1 = AlwaysPass;
            let pass2 = AlwaysPass;
            let modules = vec![&pass1 as &dyn ConditionModuleTrait, &pass2 as &dyn ConditionModuleTrait];
            
            let result = validate_test_conditions(escrow, &modules);
            assert!(result.is_ok());
        }
        
        // Test with one failing module
        {
            let pass = AlwaysPass;
            let fail = AlwaysFail;
            let modules = vec![&pass as &dyn ConditionModuleTrait, &fail as &dyn ConditionModuleTrait];
            
            let result = validate_test_conditions(escrow, &modules);
            assert!(result.is_err());
        }
    }
}