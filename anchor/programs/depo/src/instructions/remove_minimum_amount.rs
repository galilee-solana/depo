use anchor_lang::prelude::*;
use crate::states::{Escrow, MinimumAmount, ModuleType, Status};
use crate::errors::{EscrowErrors};


/// Remove minimum amount condition from the escrow
///
/// # Arguments
/// * `ctx` - The context containing the escrow account, minimum amount account 
/// and signer (the initializer of the escrow)
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn remove_minimum_amount(
    ctx: Context<RemoveMinimumAmount>,
) -> Result<()> {
    let escrow = &mut ctx.accounts.escrow;
    require!(
        escrow.modules.contains(&ModuleType::MinimumAmount), 
        EscrowErrors::ModuleDoesntExist
    );

    require!(escrow.status == Status::Draft, EscrowErrors::EscrowNotDraft);

    if let Some(index) = escrow.modules.iter().position(|m| *m == ModuleType::MinimumAmount) {
        escrow.modules.remove(index);
    }

    Ok(())
}

#[derive(Accounts)]
pub struct RemoveMinimumAmount<'info> {
    #[account(mut, has_one = initializer)]
    pub escrow: Account<'info, Escrow>,

    #[account(
      mut,
      seeds = [b"minimum_amount", escrow.key().as_ref()],
      bump,
      close = initializer
    )]
    pub minimum_amount: Account<'info, MinimumAmount>,

    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}