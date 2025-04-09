use anchor_lang::prelude::*;
use crate::states::{Escrow};

/// Adds a recipient to the escrow
///
/// # Arguments
/// * `ctx` - The context containing the account and signer
/// * `escrow_id` - The unique identifier for the escrow
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn add_recipient(
    ctx: Context<AddRecipientCtx>,
    escrow_id: [u8; 16]
) -> Result<()> {
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

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}