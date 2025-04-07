use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Escrow {
  pub id: [u8; 16], // UUID in bytes
  pub initialiser: Pubkey,
  pub name: [u8; 100],
  pub description: [u8; 200],
  pub total_amount: u64,
  pub is_public_deposit: bool,
  pub depositors_count: u32,
  pub recipients_count: u32,
  #[max_len(10)]
  pub modules: Vec<ModuleType>,
  pub status: Status,
  pub created_at: i64
}