use anchor_lang::prelude::*;

#[derive(InitSpace, AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum Status {
    Draft,
    Started,
    Released,
    Cancelled,
    Expired
}