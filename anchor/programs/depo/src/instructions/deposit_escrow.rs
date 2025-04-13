use crate::errors::EscrowErrors;
use crate::states::{Depositor, Escrow, Status};
use anchor_lang::prelude::*;
use anchor_lang::system_program;

/// Deposit to the escrow
///
/// # Arguments
/// * `ctx` - The context containing the account and signer
/// * `_escrow_id` - The unique identifier (UUID) for the escrow
/// * `amount` - The amount to deposit to the escrow in lamports
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn deposit_escrow(
    ctx: Context<DepositEscrow>,
    _escrow_id: [u8; 16],
    amount: u64,
) -> Result<()> {
    require!(amount > 0, EscrowErrors::InvalidDepositAmount);
    
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.signer.to_account_info(),
                to: ctx.accounts.escrow.to_account_info(),
            },
        ),
        amount,
    )?;

    let depositor = &mut ctx.accounts.depositor;
    depositor.amount += amount;

    Ok(())
}

#[derive(Accounts)]
#[instruction(escrow_id: [u8; 16])]
pub struct DepositEscrow<'info> {
    #[account(
      mut,
      seeds = [b"escrow", escrow_id.as_ref()],
      bump,
      constraint = escrow.status == Status::Started @ EscrowErrors::EscrowNotStarted
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        mut,
        seeds = [b"depositor", escrow.key().as_ref(), signer.key().as_ref()],
        bump,
        constraint = depositor.wallet == signer.key() @ EscrowErrors::UnauthorizedDepositor
    )]
    pub depositor: Account<'info, Depositor>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
