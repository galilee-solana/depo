use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;
use crate::states::{Escrow, Status};

/// Creates a new escrow account with the given parameters
///
/// # Arguments
/// * `ctx` - The context containing the escrow account and signer
/// * `escrow_id` - Unique identifier for the escrow (16 byte UUID)
/// * `name` - Name of the escrow (100 bytes max)
/// * `description` - Description of the escrow (200 bytes max)
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn create_escrow(
    ctx: Context<CreateEscrowCtx>,
    escrow_id: [u8; 16],
    name: [u8; 100],
    description: [u8; 200]
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    escrow.id = escrow_id;
    escrow.initialiser = ctx.accounts.signer.key();
    escrow.name = name;
    escrow.description = description;

    escrow.total_amount = 0;
    escrow.depositors_count = 0;
    escrow.recipients_count = 0;
    escrow.status = Status::Draft;

    escrow.created_at = Clock::get()?.unix_timestamp;
    Ok(())
}

#[derive(Accounts)]
#[instruction(escrow_id: [u8; 16])]
pub struct CreateEscrowCtx<'info> {
    #[account(
      init,
      payer = signer,
      space = 8, // TODO: Implement InitSpace
      seeds = [b"escrow", escrow_id.as_ref()],
      bump
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}