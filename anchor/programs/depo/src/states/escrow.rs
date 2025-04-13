use anchor_lang::prelude::*;
use crate::states::modules::ModuleAccount;
use crate::states::status::Status;
use crate::constants::MAX_MODULES;

#[account]
#[derive(InitSpace)]
pub struct Escrow {
  pub id: [u8; 16], // UUID in bytes
  pub initializer: Pubkey,
  pub name: [u8; 100],
  pub description: [u8; 200],
  pub total_amount: u64,
  pub is_public_deposit: bool,
  pub depositors_count: u32,
  pub recipients_count: u32,
  #[max_len(MAX_MODULES)]
  pub modules: Vec<ModuleAccount>,
  pub status: Status,
  pub created_at: i64
}