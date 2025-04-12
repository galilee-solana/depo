use crate::states::EscrowContext;
use anchor_lang::prelude::*;

pub trait ConditionModule {
    fn is_satisfied(&self, escrow_account: &dyn EscrowContext) -> Result<()>;
}
