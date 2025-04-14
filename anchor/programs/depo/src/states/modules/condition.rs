use crate::states::{EscrowContext, MinimumAmount};
use anchor_lang::prelude::*;


pub trait ConditionModule {
    fn is_satisfied(&self, escrow_account: &dyn EscrowContext) -> Result<()>;
}

pub enum ModuleCondition<'info> {
    MinimumAmount(Account<'info, MinimumAmount>),
    // Add other module types as they are implemented
}

impl<'info> ModuleCondition<'info> {
    pub fn is_satisfied(&self, escrow_account: &dyn EscrowContext) -> Result<()> {
        match self {
            ModuleCondition::MinimumAmount(module) => module.is_satisfied(escrow_account),
            // Add other module types as they are implemented
        }
    }
}