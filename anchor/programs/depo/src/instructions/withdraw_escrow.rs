use crate::errors::EscrowErrors;
use crate::states::{Escrow, Recipient, Status};
use anchor_lang::prelude::*;

/// Withdraw from the escrow
///
/// # Arguments
/// * `ctx` - The context containing the accounts and signer
/// * `_escrow_id` - The unique identifier (UUID) for the escrow
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn withdraw_escrow(
    ctx: Context<WithdrawEscrow>,
    _escrow_id: [u8; 16],
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    require!(escrow.status == Status::Released, EscrowErrors::WithdrawInvalidEscrowStatus);
    
    let recipient = &mut ctx.accounts.recipient;
    require!(!recipient.has_withdrawn, EscrowErrors::AlreadyWithdrawn);
   
    let amount = recipient.percentage as u64 * escrow.deposited_amount  / 10000;

    let escrow_lamports = **ctx.accounts.escrow.to_account_info().lamports.borrow();
    require!(escrow_lamports >= amount, EscrowErrors::InsufficientFunds);

    **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= amount;
    **ctx.accounts.signer.to_account_info().try_borrow_mut_lamports()? += amount;

    recipient.has_withdrawn = true;

    Ok(())
}

#[derive(Accounts)]
#[instruction(escrow_id: [u8; 16])]
pub struct WithdrawEscrow<'info> {
    #[account(
      mut,
      seeds = [b"escrow", escrow_id.as_ref()],
      bump,
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        mut,
        seeds = [b"recipient", escrow.key().as_ref(), signer.key().as_ref()],
        bump,
        constraint = recipient.wallet == signer.key() @ EscrowErrors::UnauthorizedToWithdraw
    )]
    pub recipient: Account<'info, Recipient>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
