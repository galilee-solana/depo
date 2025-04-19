#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("Dsq9mG9PRPUNve4eMNToJ37KobXfUqeYLKAA6w4LsbA3");

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
        wallet: Pubkey,
        percentage: u16
    ) -> Result<()> {
        instructions::add_recipient(ctx, escrow_id, wallet, percentage)
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

    pub fn add_target_amount(
        ctx: Context<AddTargetAmount>,
        escrow_id: [u8; 16],
        amount: u64
    ) -> Result<()> {
        instructions::add_target_amount(ctx, escrow_id, amount)
    }

    pub fn remove_target_amount(
        ctx: Context<RemoveTargetAmount>,
        escrow_id: [u8; 16],
    ) -> Result<()> {
        instructions::remove_target_amount(ctx, escrow_id)
    }

    pub fn add_timelock(
        ctx: Context<AddTimelock>,
        escrow_id: [u8; 16],
        release_after: u64
    ) -> Result<()> {
        instructions::add_timelock(ctx, escrow_id, release_after)
    }
    
    pub fn remove_timelock(
        ctx: Context<RemoveTimelock>,
        escrow_id: [u8; 16],
    ) -> Result<()> {
        instructions::remove_timelock(ctx, escrow_id)
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
    
    pub fn release_escrow<'a, 'b, 'c, 'info>(
        ctx: Context<'a, 'b, 'c, 'info, ReleaseEscrow<'info>>,
        escrow_id: [u8; 16],
    ) -> Result<()> 
    where
        'c: 'info,
    {
        instructions::release_escrow(ctx, escrow_id)
    }

    pub fn withdraw_escrow(
        ctx: Context<WithdrawEscrow>,
        escrow_id: [u8; 16],
    ) -> Result<()> {
        instructions::withdraw_escrow(ctx, escrow_id)
    }
    
    pub fn cancel_escrow(
        ctx: Context<CancelEscrow>,
        escrow_id: [u8; 16],
    ) -> Result<()> {
        instructions::cancel_escrow(ctx, escrow_id)
    }
    
    pub fn refund_depositor(
        ctx: Context<RefundDepositor>,
        escrow_id: [u8; 16],
    ) -> Result<()> {
        instructions::refund_depositor(ctx, escrow_id)
    }
}