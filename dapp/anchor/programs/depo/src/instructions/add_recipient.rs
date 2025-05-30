use anchor_lang::prelude::*;
use crate::states::{Escrow, Recipient, Status};
use crate::errors::EscrowErrors;
use crate::constants::{ANCHOR_DISCRIMINATOR, MAX_PERCENTAGE};

/// Adds a recipient to the escrow
///
/// # Arguments
/// * `ctx` - The context containing the account and signer
/// * `_escrow_id` - The unique identifier (UUID) for the escrow
/// * `wallet` - The wallet address of the recipient
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn add_recipient(
    ctx: Context<AddRecipient>,
    _escrow_id: [u8; 16],
    wallet: Pubkey,
    percentage: u16,
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    require!(escrow.status == Status::Draft, EscrowErrors::EscrowNotDraft);
    
    require!(percentage <= MAX_PERCENTAGE, EscrowErrors::MaxPercentage);
    require!(escrow.remaining_percentage >= percentage, EscrowErrors::EscrowPercentageFull);

    let recipient = &mut ctx.accounts.recipient;
    recipient.escrow = escrow.key();
    recipient.wallet = wallet;
    recipient.percentage = percentage;
    recipient.has_withdrawn = false;

    escrow.recipients_count += 1;
    escrow.remaining_percentage -= percentage;

    Ok(())
}

#[derive(Accounts)]
#[instruction(escrow_id: [u8; 16], wallet: Pubkey)]
pub struct AddRecipient<'info> {
    #[account(
      mut,
      seeds = [b"escrow", escrow_id.as_ref()],
      bump,
      has_one = initializer @ EscrowErrors::UnauthorizedRecipientModifier,
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
        init,
        payer = initializer,
        space = ANCHOR_DISCRIMINATOR + Recipient::INIT_SPACE,
        seeds = [b"recipient", escrow.key().as_ref(),  wallet.as_ref()],
        bump,
        constraint = escrow.initializer == initializer.key() @ EscrowErrors::UnauthorizedRecipientModifier,
    )]
    pub recipient: Account<'info, Recipient>,

    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}