use anchor_lang::prelude::*;
use crate::states::modules::ModuleType;

#[derive(InitSpace, AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ModuleReference {
  pub module_type: ModuleType,
  pub key: Pubkey,
}