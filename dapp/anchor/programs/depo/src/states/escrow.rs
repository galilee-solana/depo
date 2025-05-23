use anchor_lang::prelude::*;
use crate::states::modules::ModuleReference;
use crate::states::status::Status;
use crate::constants::MAX_MODULES;

#[account]
#[derive(InitSpace)]
pub struct Escrow {
  pub id: [u8; 16], // UUID in bytes
  pub initializer: Pubkey,
  pub name: [u8; 100],
  pub description: [u8; 200],
  pub deposited_amount: u64,
  pub withdrawn_amount: u64,
  pub remaining_percentage: u16,
  pub is_public_deposit: bool,
  pub depositors_count: u32,
  pub recipients_count: u32,
  #[max_len(MAX_MODULES)]
  pub modules: Vec<ModuleReference>,
  pub status: Status,
  pub created_at: i64,
  pub started_at: i64
}