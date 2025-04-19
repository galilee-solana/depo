use anchor_lang::prelude::*;

#[derive(InitSpace, AnchorSerialize, AnchorDeserialize, Clone, Eq, PartialEq)]
pub enum ModuleType {
    Timelock,
    ExpiryFallback,
    SingleApproval,
    MultisigApproval,
    TargetAmount,
    MinimumAmount
}