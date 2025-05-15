use crate::constants::ANCHOR_DISCRIMINATOR;
use crate::errors::EscrowErrors;
use crate::states::{Depositor, Escrow, Status};
use anchor_lang::prelude::*;

/// Adds a depositor to the escrow
///
/// # Arguments
/// * `ctx` - The context containing the account and signer
/// * `_escrow_id` - The unique identifier (UUID) for the escrow
/// * `wallet` - The wallet address of the depositor
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn add_depositor(
    ctx: Context<AddDepositor>,
    _escrow_id: [u8; 16],
    wallet: Pubkey,
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    require!(escrow.status == Status::Draft, EscrowErrors::EscrowNotDraft);

    let depositor = &mut ctx.accounts.depositor;
    depositor.escrow = escrow.key();
    depositor.wallet = wallet;
    depositor.deposited_amount = 0;
    depositor.was_refunded = false;

    escrow.depositors_count += 1;
    escrow.is_public_deposit = false;
    depositor.is_initialized = true;

    Ok(())
}

#[derive(Accounts)]
#[instruction(escrow_id: [u8; 16], wallet: Pubkey)]
pub struct AddDepositor<'info> {
    #[account(
      mut,
      seeds = [b"escrow", escrow_id.as_ref()],
      bump,
      has_one = initializer @ EscrowErrors::UnauthorizedDepositorModifier,
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        init,
        payer = initializer,
        space = ANCHOR_DISCRIMINATOR + Depositor::INIT_SPACE,
        seeds = [b"depositor", escrow.key().as_ref(),  wallet.as_ref()],
        bump,
        constraint = escrow.initializer == initializer.key() @ EscrowErrors::UnauthorizedDepositorModifier,
    )]
    pub depositor: Account<'info, Depositor>,

    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
