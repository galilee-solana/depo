use anchor_lang::prelude::*;

// TODO: Calculate the size of the account

#[account]
pub struct Escrow {
  pub id: String,                // uuid (36 bytes + 4 bytes for length = 40 bytes)
  pub initialiser: Pubkey,      // 32 bytes
  #[max_len(50)]
  pub name: String,             // 50 bytes + 4 bytes for length = 54 bytes
  #[max_len(200)]
  pub description: String,      // 200 bytes + 4 bytes for length = 204 bytes
  pub total_amount: u64,        // 8 bytes
  pub is_public_deposit: bool,  // 1 byte
  pub depositors_count: u32,    // 4 bytes
  pub recipients_count: u32,    // 4 bytes
  pub modules: Vec<ModuleType>, // 4 bytes + (n * size of ModuleType)
  pub status: Status,           // 1 byte (enum)
  pub created_at: i64           // 8 bytes
}