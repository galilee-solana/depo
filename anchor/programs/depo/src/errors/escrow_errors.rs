use anchor_lang::prelude::*;

#[error_code]
pub enum EscrowErrors {
    #[msg("Escrow name is too long. Max length: 100 bytes.")]
    NameTooLong,
    #[msg("Escrow description is too long. Max length: 200 bytes.")]
    DescriptionTooLong,
    #[msg("Unauthorized to add or remove recipient")]
    UnauthorizedRecipientModifier,
    #[msg("Escrow must be in Draft status to modify it")]
    EscrowNotDraft,
    #[msg("No recipients in escrow")]
    NoRecipients,
    #[msg("This module type already exists.")]
    ModuleAlreadyExists,
    #[msg("This module type doesn't exist.")]
    ModuleDoesntExist,
}