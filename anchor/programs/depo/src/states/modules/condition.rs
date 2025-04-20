use crate::states::{Escrow, MinimumAmount};
use anchor_lang::prelude::*;
use crate::states::modules::target_amount::TargetAmount;
use crate::states::modules::timelock::Timelock;

pub enum ConditionModule {
    MinimumAmount(MinimumAmount),
    TargetAmount(TargetAmount),
    Timelock(Timelock)
    // Add other module types as they are implemented
}

impl ConditionModule {
    pub fn is_satisfied(&self, escrow: &Escrow) -> Result<()> {
        match self {
            ConditionModule::MinimumAmount(module) => module.is_satisfied(escrow),
            ConditionModule::TargetAmount(module) => module.is_satisfied(escrow),
            ConditionModule::Timelock(module) => module.is_satisfied(escrow),
            // Add other module types as they are implemented
        }
    }
}