use anchor_lang::prelude::*;
use crate::states::{Escrow, Recipient, Status};
use crate::errors::EscrowErrors;

/// Removes a recipient from the escrow
///
/// # Arguments
/// * `ctx` - The context containing the account and signer
/// * `_escrow_id` - The unique identifier (UUID) for the escrow
/// * `_wallet` - The wallet address of the recipient
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn remove_recipient(
    ctx: Context<RemoveRecipient>,
    _escrow_id: [u8; 16],
    _wallet: Pubkey
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    require!(escrow.status == Status::Draft, EscrowErrors::EscrowNotDraft);
    require!(escrow.recipients_count > 0, EscrowErrors::NoRecipients);

    escrow.recipients_count -= 1;
    escrow.remaining_percentage += ctx.accounts.recipient.percentage;

    Ok(())
}

#[derive(Accounts)]
#[instruction(escrow_id: [u8; 16], wallet: Pubkey)]
pub struct RemoveRecipient<'info> {
    #[account(
      mut,
      seeds = [b"escrow", escrow_id.as_ref()],
      bump,
      has_one = initializer @ EscrowErrors::UnauthorizedRecipientModifier,
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        mut,
        seeds = [b"recipient", escrow.key().as_ref(), wallet.as_ref()],
        bump,
        constraint = escrow.initializer == initializer.key() @ EscrowErrors::UnauthorizedRecipientModifier,
        close = initializer // TODO: Change to a fee collector (initialiser for now)
    )]
    pub recipient: Account<'info, Recipient>,

    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}