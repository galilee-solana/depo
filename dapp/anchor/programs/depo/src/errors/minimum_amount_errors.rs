use anchor_lang::prelude::*;

#[error_code]
pub enum MinimumAmountErrors {
    #[msg("Minimum amount must be greater than 0.")]
    MinimumAmountGreaterThanZero,
    #[msg("Amount deposited is too low.")]
    InsufficientAmount
}
