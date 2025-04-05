use anchor_lang::prelude::*;

#[derive(InitSpace, AnchorSerialize, AnchorDeserialize, Clone)]
pub enum ModuleType {
    TimeLock,
    ExpiryFallback,
    SingleApproval,
    MultisigApproval,
    TargetAmount,
    MinimumAmount
}
