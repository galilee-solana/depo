use anchor_lang::prelude::*;
use crate::states::{Escrow, Status};

pub fn create_escrow(
    ctx: Context<CreateEscrow>,
    name: String,
    description: String,
    
) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct CreateEscrow<'info> {
    #[account(
      init,
      payer = signer.
      space = // TODO: implement InitSpace
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}