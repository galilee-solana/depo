use anchor_lang::prelude::*;
use crate::states::{Escrow, Recipient, Status};
use crate::errors::EscrowErrors;

/// Removes a recipient from the escrow
///
/// # Arguments
/// * `ctx` - The context containing the account and signer
/// * `_escrow_id` - The unique identifier (UUID) for the escrow
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn remove_recipient(
    ctx: Context<RemoveRecipient>,
    _escrow_id: [u8; 16]
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    escrow.recipients_count -= 1;

    Ok(())
}

#[derive(Accounts)]
#[instruction(escrow_id: [u8; 16])]
pub struct RemoveRecipient<'info> {
    #[account(
      mut,
      seeds = [b"escrow", escrow_id.as_ref()],
      bump
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        mut,
        seeds = [b"recipient", escrow.key().as_ref(), signer.key().as_ref()],
        bump,
        constraint = escrow.initialiser == signer.key() @ EscrowErrors::UnauthorizedRecipientModifier, // Only the initialiser can remove a recipient
        constraint = escrow.status == Status::Draft @ EscrowErrors::EscrowNotDraft,
        close = signer // TODO: Change to a fee collector (initialiser for now)
    )]
    pub recipient: Account<'info, Recipient>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}