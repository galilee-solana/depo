use crate::states::modules::ConditionModule;
use crate::states::Escrow;
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
#[allow(dead_code)] // TODO remove this when the method will be used
pub fn validate_escrow_conditions(
    escrow: &dyn EscrowContext,
    modules: &[&dyn ConditionModule]
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
    use super::*;
    
    #[error_code]
    pub enum MyConditionErrors {
        #[msg("Always fails for testing")]
        AlwaysFails,
    }
    
    struct AlwaysPass;
    impl ConditionModule for AlwaysPass {
        fn is_satisfied(&self, _escrow: &dyn EscrowContext) -> anchor_lang::Result<()> {
            Ok(())
        }
    }

    struct AlwaysFail;
    impl ConditionModule for AlwaysFail {
        fn is_satisfied(&self, _escrow: &dyn EscrowContext) -> anchor_lang::Result<()> {
            err!(MyConditionErrors::AlwaysFails) 
        }
    }

    #[test]
    fn test_all_conditions_pass() {
        let escrow = &MockEscrow{balance: 1000};
        let modules: [&dyn ConditionModule; 2] = [&AlwaysPass, &AlwaysPass];
        assert!(validate_escrow_conditions(escrow, &modules).is_ok());
    }

    #[test]
    fn test_one_condition_fails() {
        let escrow = &MockEscrow{balance: 1000};
        let modules: [&dyn ConditionModule; 2] = [&AlwaysPass, &AlwaysFail];
        assert!(validate_escrow_conditions(escrow, &modules).is_err());
    }
}