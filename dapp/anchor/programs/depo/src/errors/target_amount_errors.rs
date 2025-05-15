use anchor_lang::prelude::*;

#[error_code]
pub enum TargetAmountErrors {
    #[msg("Target amount must be greater than 0.")]
    TargetAmountGreaterThanZero,
    #[msg("Amount deposited does not match target amount.")]
    AmountNotReached
}
