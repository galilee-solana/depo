use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;
use crate::states::{Escrow, Status};

pub fn create_escrow(
    ctx: Context<CreateEscrow>,
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
pub struct CreateEscrow<'info> {
    #[account(
      init,
      payer = signer,
      space = 8 + // TODO: Implement InitSpace
      seeds = [b"escrow", &escrow_id.to_le_bytes()],
      bump
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}