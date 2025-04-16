use anchor_lang::prelude::*;

#[error_code]
pub enum ReleaseErrors {
    #[msg("Invalid number of accounts.")]
    InvalidNumberOfAccounts,
    #[msg("This module is not found.")]
    ModuleNotFound,
    #[msg("You cannot add the same module twice.")]
    ModuleAlreadyAdded,
    #[msg("You passed an unsupported module type.")]
    UnsupportedModule,
    #[msg("Validation failed. The escrow is not released.")]
    ValidationFailed,
}