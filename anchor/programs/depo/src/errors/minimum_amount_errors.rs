use anchor_lang::prelude::*;

#[error_code]
pub enum MinimumAmountErrors {
    #[msg("Minimum amount must be greater than 0.")]
    MinimumAmountGreaterThanZero
}
