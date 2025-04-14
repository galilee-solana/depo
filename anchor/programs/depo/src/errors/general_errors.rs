use anchor_lang::prelude::*;

#[error_code]
pub enum GeneralErrors {
  #[msg("Vector length exceeds allowed size.")]
  InvalidVectorLength,
  #[msg("Invalid account owner.")]
  InvalidAccountOwner,
}