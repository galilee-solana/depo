use anchor_lang::prelude::*;

#[error_code]
pub enum EscrowErrors {
    #[msg("Escrow name is too long. Max length: 100 bytes.")]
    NameTooLong,
    #[msg("Escrow description is too long. Max length: 200 bytes.")]
    DescriptionTooLong,
    #[msg("Unauthorized to add or remove recipient")]
    UnauthorizedRecipientModifier,
    #[msg("Unauthorized to add or remove depositor")]
    UnauthorizedDepositorModifier,
    #[msg("Escrow must be in Draft status to modify it")]
    EscrowNotDraft,
    #[msg("Escrow must be in Draft status to modify it")]
    EscrowNotStarted,
    #[msg("No recipients in escrow")]
    NoRecipients,
    #[msg("No depositors in escrow")]
    NoDepositors,
    #[msg("This module type already exists.")]
    ModuleAlreadyExists,
    #[msg("This module type doesn't exist.")]
    ModuleDoesntExist,
    #[msg("Invalid deposit amount.")]
    InvalidDepositAmount,
    #[msg("Unauthorized depositor.")]
    UnauthorizedDepositor,
}