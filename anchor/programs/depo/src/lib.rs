#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

mod constants;
mod instructions;
mod states;
mod errors;
mod utils;

use instructions::*;

#[program]
pub mod depo {
    use super::*;

    pub fn create_escrow(
        ctx: Context<CreateEscrow>,
        escrow_id: [u8; 16],
        name: Vec<u8>,
        description: Vec<u8>
    ) -> Result<()> {
        instructions::create_escrow(ctx, escrow_id, name, description)
    }

    pub fn add_recipient(
        ctx: Context<AddRecipient>,
        escrow_id: [u8; 16],
        wallet: Pubkey
    ) -> Result<()> {
        instructions::add_recipient(ctx, escrow_id, wallet)
    }

    pub fn remove_recipient(
        ctx: Context<RemoveRecipient>,
        escrow_id: [u8; 16],
        wallet: Pubkey
    ) -> Result<()> {
        instructions::remove_recipient(ctx, escrow_id, wallet)
    }

    pub fn add_depositor(
        ctx: Context<AddDepositor>,
        escrow_id: [u8; 16],
        wallet: Pubkey
    ) -> Result<()> {
        instructions::add_depositor(ctx, escrow_id, wallet)
    }

    pub fn remove_depositor(
        ctx: Context<RemoveDepositor>,
        escrow_id: [u8; 16],
        wallet: Pubkey
    ) -> Result<()> {
        instructions::remove_depositor(ctx, escrow_id, wallet)
    }

    pub fn add_minimum_amount(
        ctx: Context<AddMinimumAmount>,
        escrow_id: [u8; 16],
        amount: u64
    ) -> Result<()> {
        instructions::add_minimum_amount(ctx, escrow_id, amount)
    }

    pub fn remove_minimum_amount(
        ctx: Context<RemoveMinimumAmount>,
        escrow_id: [u8; 16],
    ) -> Result<()> {
        instructions::remove_minimum_amount(ctx, escrow_id)
    }

    pub fn deposit_escrow(
        ctx: Context<DepositEscrow>,
        escrow_id: [u8; 16],
        amount: u64,
    ) -> Result<()> {
        instructions::deposit_escrow(ctx, escrow_id, amount)
    }
    
    pub fn start_escrow(
        ctx: Context<StartEscrow>,
        escrow_id: [u8; 16],
    ) -> Result<()> {
        instructions::start_escrow(ctx, escrow_id)
    }
}