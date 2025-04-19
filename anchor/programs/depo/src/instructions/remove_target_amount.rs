use crate::errors::EscrowErrors;
use crate::states::{Escrow, ModuleType, Status, TargetAmount};
use anchor_lang::prelude::*;

/// Remove target amount condition from the escrow
///
/// # Arguments
/// * `ctx` - The context containing the escrow account, target amount account
/// and signer (the initializer of the escrow)
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn remove_target_amount(ctx: Context<RemoveTargetAmount>, _escrow_id: [u8; 16]) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    require!(escrow.status == Status::Draft, EscrowErrors::EscrowNotDraft);

    if let Some(index) = escrow
        .modules
        .iter()
        .position(|m| m.module_type == ModuleType::TargetAmount)
    {
        escrow.modules.remove(index);
    } else {
        return Err(error!(EscrowErrors::ModuleDoesntExist));
    }

    Ok(())
}

#[derive(Accounts)]
#[instruction(escrow_id: [u8; 16])]
pub struct RemoveTargetAmount<'info> {
    #[account(
        mut,
        seeds = [b"escrow", escrow_id.as_ref()],
        bump,
        has_one = initializer
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
      mut,
      seeds = [b"target_amount", escrow.key().as_ref()],
      bump,
      close = initializer
    )]
    pub target_amount: Account<'info, TargetAmount>,

    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
