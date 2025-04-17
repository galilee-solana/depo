use crate::errors::EscrowErrors;
use crate::states::{Depositor, Escrow, Status};
use anchor_lang::prelude::*;

/// Refunds a depositor
///
/// # Arguments
/// * `ctx` - The context containing the account and signer
/// * `_escrow_id` - The unique identifier (UUID) for the escrow
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn refund_depositor(
    ctx: Context<RefundDepositor>,
    _escrow_id: [u8; 16],
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    require!(
        escrow.status == Status::Cancelled || escrow.status ==  Status::Expired,
        EscrowErrors::RefundInvalidEscrowStatus
    );

    let depositor = &mut ctx.accounts.depositor;
    require!(
        !depositor.was_refunded,
        EscrowErrors::AlreadyRefunded
    );
    require!(
        depositor.deposited_amount < escrow.to_account_info().lamports(), 
        EscrowErrors::InsufficientFunds
    );
    
    **escrow.to_account_info().try_borrow_mut_lamports()? -= depositor.deposited_amount;
    **ctx.accounts.signer.to_account_info().try_borrow_mut_lamports()? += depositor.deposited_amount;

    depositor.was_refunded = true;

    Ok(())
}

#[derive(Accounts)]
#[instruction(escrow_id: [u8; 16])]
pub struct RefundDepositor<'info> {
    #[account(
      mut,
      seeds = [b"escrow", escrow_id.as_ref()],
      bump,
      constraint = depositor.escrow == escrow.key(),
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        mut,
        seeds = [b"depositor", escrow.key().as_ref(),  signer.key().as_ref()],
        bump,
        constraint = depositor.wallet == signer.key() @ EscrowErrors::RefundUnauthorizedDepositor,
    )]
    pub depositor: Account<'info, Depositor>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
