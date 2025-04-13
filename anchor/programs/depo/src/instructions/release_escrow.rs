use anchor_lang::prelude::*;
use crate::states::{Escrow, Status};
use crate::errors::EscrowErrors;


/// Releases the escrow 
///
/// # Arguments
/// * `ctx` - The context containing the escrow account and signer
/// * `escrow_id` - Unique identifier for the escrow (16 byte UUID)
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn release_escrow(
    ctx: Context<ReleaseEscrow>,
    _escrow_id: [u8; 16],
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    require!(escrow.status == Status::Started, EscrowErrors::EscrowNotStarted);

    // TODO check conditions for release
    
    escrow.status = Status::Released;

    Ok(())
}

#[derive(Accounts)]
#[instruction(escrow_id: [u8; 16])]
pub struct ReleaseEscrow<'info> {
    #[account(
      mut, 
      seeds = [b"escrow", escrow_id.as_ref()],
      bump,
      has_one = initializer,
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}