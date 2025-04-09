use anchor_lang::prelude::*;
use crate::states::{Escrow, Recipient};
use crate::errors::EscrowErrors;
/// Adds a recipient to the escrow
///
/// # Arguments
/// * `ctx` - The context containing the account and signer
/// * `_escrow_id` - The unique identifier (UUID) for the escrow
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn add_recipient(
    ctx: Context<AddRecipientCtx>,
    _escrow_id: [u8; 16]
) -> Result<()> {
    let recipient = &mut ctx.accounts.recipient;
    recipient.escrow = ctx.accounts.escrow.key();
    recipient.wallet = ctx.accounts.signer.key();
    recipient.amount = 0;
    recipient.has_withdrawn = false;

    let escrow = &mut ctx.accounts.escrow;
    escrow.recipients_count += 1;    

    Ok(())
}

#[derive(Accounts)]
#[instruction(escrow_id: [u8; 16])]
pub struct AddRecipientCtx<'info> {
    #[account(
      mut,
      seeds = [b"escrow", escrow_id.as_ref()],
      bump
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        init,
        payer = signer,
        space = Recipient::INIT_SPACE,
        seeds = [b"recipient", escrow.key().as_ref(), signer.key().as_ref()],
        bump,
        constraint = escrow.initialiser == signer.key() @ EscrowErrors::UnauthorizedRecipientModifier, // Only the initialiser can add a recipient
    )]
    pub recipient: Account<'info, Recipient>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}