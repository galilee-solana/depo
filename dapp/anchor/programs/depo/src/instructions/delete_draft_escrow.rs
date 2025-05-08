use anchor_lang::prelude::*;
use crate::states::{Escrow, Status};
use crate::errors::EscrowErrors;

/// Deletes a draft escrow
///
/// # Arguments
/// * `ctx` - The context containing the account and signer
/// * `_escrow_id` - The unique identifier (UUID) for the escrow
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn delete_draft_escrow(
    ctx: Context<DeleteDraftEscrow>,
    _escrow_id: [u8; 16]
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    require!(escrow.status == Status::Draft, EscrowErrors::EscrowNotDraft);

    require!(escrow.depositors_count == 0, EscrowErrors::DepositorsExist);
    require!(escrow.recipients_count == 0, EscrowErrors::RecipientsExist);
    require!(escrow.modules.is_empty(), EscrowErrors::ModulesExist);
    
    Ok(())
}

#[derive(Accounts)]
#[instruction(escrow_id: [u8; 16])]
pub struct DeleteDraftEscrow<'info> {
    #[account(
      mut,
      seeds = [b"escrow", escrow_id.as_ref()],
      bump,
      has_one = initializer @ EscrowErrors::UnauthorizedRecipientModifier,
      close = initializer // TODO: Change to a fee collector (initialiser for now)
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}