use anchor_lang::prelude::*;
use crate::states::{Escrow, Depositor, Status};
use crate::errors::EscrowErrors;

/// Removes a depositor from the escrow
///
/// # Arguments
/// * `ctx` - The context containing the account and signer
/// * `_escrow_id` - The unique identifier (UUID) for the escrow
/// * `_wallet` - The wallet address of the depositor
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn remove_depositor(
    ctx: Context<RemoveDepositor>,
    _escrow_id: [u8; 16],
    _wallet: Pubkey
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    require!(escrow.status == Status::Draft, EscrowErrors::EscrowNotDraft);
    require!(escrow.depositors_count > 0, EscrowErrors::NoDepositors);

    escrow.depositors_count -= 1;
    if escrow.depositors_count == 0 {
        escrow.is_public_deposit = true;
    }

    Ok(())
}

#[derive(Accounts)]
#[instruction(escrow_id: [u8; 16], wallet: Pubkey)]
pub struct RemoveDepositor<'info> {
    #[account(
      mut,
      seeds = [b"escrow", escrow_id.as_ref()],
      bump,
      has_one = initializer @ EscrowErrors::UnauthorizedDepositorModifier,
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        mut,
        seeds = [b"depositor", escrow.key().as_ref(), wallet.as_ref()],
        bump,
        constraint = escrow.initializer == initializer.key() @ EscrowErrors::UnauthorizedDepositorModifier,
        close = initializer // TODO: Change to a fee collector (initialiser for now)
    )]
    pub depositor: Account<'info, Depositor>,

    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}