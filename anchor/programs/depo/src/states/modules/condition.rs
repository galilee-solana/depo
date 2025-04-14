use crate::states::{EscrowContext, MinimumAmount};
use anchor_lang::prelude::*;


pub trait ConditionModuleTrait {
    fn is_satisfied(&self, escrow_account: &dyn EscrowContext) -> Result<()>;
}

pub enum ConditionModule<'info> {
    MinimumAmount(Account<'info, MinimumAmount>),
    // Add other module types as they are implemented
}

impl<'info> ConditionModule<'info> {
    pub fn is_satisfied(&self, escrow_account: &dyn EscrowContext) -> Result<()> {
        match self {
            ConditionModule::MinimumAmount(module) => module.is_satisfied(escrow_account),
            // Add other module types as they are implemented
        }
    }
}