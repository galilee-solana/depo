use anchor_lang::prelude::*;
use super::modules::ModuleType;
use super::status::Status;


// TODO: Calculate the size of the account

#[account]
pub struct Escrow {
  pub id: [u8; 16],             // UUID as bytes (16 bytes)
  pub initialiser: Pubkey,      // 32 bytes
  pub name: [u8; 100],          // 100 bytes
  pub description: [u8; 200],   // 200 bytes
  pub total_amount: u64,        // 8 bytes
  pub is_public_deposit: bool,  // 1 byte
  pub depositors_count: u32,    // 4 bytes
  pub recipients_count: u32,    // 4 bytes
  pub modules: Vec<ModuleType>, // 4 bytes + (n * size of ModuleType)
  pub status: Status,           // 1 byte (enum)
  pub created_at: i64           // 8 bytes
}