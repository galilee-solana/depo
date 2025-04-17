use crate::states::modules::ConditionModule;
use crate::states::Escrow;

use anyhow::Result;

/// Validates escrow modules conditions
///  
/// # Arguments
/// * `escrow` - The escrow account
/// * `modules` - a slice of ConditionModule to validate
///
/// # Returns
/// * `Result<()>` - Result indicating conditions validation success or failure
pub fn validate_module_conditions(escrow: &Escrow, modules: &[ConditionModule]) -> Result<()> {
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
    use super::*;
    use crate::states::{MinimumAmount, TargetAmount, Status};

    #[test]
    fn test_validate_pass() {
        let escrow = &Escrow {
            id: [0u8; 16],
            initializer: Default::default(),
            name: [0u8; 100],
            description: [0u8; 200],
            deposited_amount: 100,
            withdrawn_amount: 0,
            remaining_percentage: 0,
            is_public_deposit: false,
            depositors_count: 0,
            recipients_count: 0,
            modules: vec![],
            status: Status::Draft,
            created_at: 0,
        };

        // Test with all passing modules

        let min_amount = ConditionModule::MinimumAmount(MinimumAmount { min_amount: 10 });
        let target_amount = ConditionModule::TargetAmount(TargetAmount{target_amount: 100});
        // let pass2 = AlwaysPass;
        let modules = &[min_amount, target_amount];

        let result = validate_module_conditions(escrow, modules);
        assert!(result.is_ok());
    }
    #[test]
    fn test_validate_fail() {
        let escrow = &Escrow {
            id: [0u8; 16],
            initializer: Default::default(),
            name: [0u8; 100],
            description: [0u8; 200],
            deposited_amount: 100,
            withdrawn_amount: 0,
            remaining_percentage: 0,
            is_public_deposit: false,
            depositors_count: 0,
            recipients_count: 0,
            modules: vec![],
            status: Status::Draft,
            created_at: 0,
        };

        let min_amount_pass = ConditionModule::MinimumAmount(MinimumAmount { min_amount: 10 });
        let target_amount_fail = ConditionModule::TargetAmount(TargetAmount{target_amount: 1000});
        let modules = &[min_amount_pass, target_amount_fail];

        let result = validate_module_conditions(escrow, modules);
        assert!(result.is_err());
    }
}
