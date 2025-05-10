use anchor_lang::prelude::*;

#[error_code]
pub enum GeneralErrors {
  #[msg("Vector length exceeds allowed size.")]
  InvalidVectorLength,
  #[msg("Account does not have the correct program id")]
  InvalidAccountOwner,
}