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
    #[msg("Max percentage is 10 000 (represents 100%)")]
    MaxPercentage,
    #[msg("Insufficient remaining percentage in the escrow")]
    EscrowPercentageFull,
    #[msg("Percentage distribution should be equal to 10 000 (100%)")]
    PercentageDistribution,
    #[msg("Recipient has already withdrawn")]
    AlreadyWithdrawn,
    #[msg("Withdraw is only available when the escrow is released")]
    WithdrawInvalidEscrowStatus,
    #[msg("Unauthorized to withdraw escrow")]
    UnauthorizedToWithdraw,
    #[msg("Escrow has insufficient funds")]
    InsufficientFunds
}