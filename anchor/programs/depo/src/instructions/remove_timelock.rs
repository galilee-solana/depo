use crate::errors::EscrowErrors;
use crate::states::{Escrow, ModuleType, Status, Timelock};
use anchor_lang::prelude::*;

/// Remove timelock condition from the escrow
///
/// # Arguments
/// * `ctx` - The context containing the escrow account, timelock  account
/// and signer (the initializer of the escrow)
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn remove_timelock(ctx: Context<RemoveTimelock>, _escrow_id: [u8; 16]) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    require!(escrow.status == Status::Draft, EscrowErrors::EscrowNotDraft);

    if let Some(index) = escrow
        .modules
        .iter()
        .position(|m| m.module_type == ModuleType::Timelock)
    {
        escrow.modules.remove(index);
    } else {
        return Err(error!(EscrowErrors::ModuleDoesntExist));
    }

    Ok(())
}

#[derive(Accounts)]
#[instruction(escrow_id: [u8; 16])]
pub struct RemoveTimelock<'info> {
    #[account(
        mut,
        seeds = [b"escrow", escrow_id.as_ref()],
        bump,
        has_one = initializer
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
      mut,
      seeds = [b"timelock", escrow.key().as_ref()],
      bump,
      close = initializer
    )]
    pub timelock: Account<'info, Timelock>,

    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
