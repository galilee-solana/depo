use anchor_lang::prelude::*;

#[error_code]
pub enum EscrowErrors {
    #[msg("Escrow name is too long.")]
    NameTooLong,
    #[msg("Escrow description is too long.")]
    DescriptionTooLong,
}