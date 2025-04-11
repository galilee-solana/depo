use anchor_lang::prelude::*;
use crate::states::{Escrow, MinimumAmount, ModuleType, Status};
use crate::constants::ANCHOR_DISCRIMINATOR;
use crate::errors::{EscrowErrors, MinimumAmountErrors};


/// Add a minimum amount condition to the escrow
///
/// # Arguments
/// * `ctx` - The context containing the escrow account and signer (the initializer of the escrow)
/// * `min_amount` - The minimum amount required to fulfill the condition
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn add_minimum_amount(
    ctx: Context<AddMinimumAmount>,
    min_amount: u64
) -> Result<()> {
    require!(min_amount > 0, MinimumAmountErrors::MinimumAmountGreaterThanZero);

    let escrow = &mut ctx.accounts.escrow;
    require!(
        !escrow.modules.contains(&ModuleType::MinimumAmount), 
        EscrowErrors::ModuleAlreadyExists
    );

    require!(escrow.status == Status::Draft, EscrowErrors::EscrowNotDraft);

    escrow.modules.push(ModuleType::MinimumAmount);

    let minimum = &mut ctx.accounts.minimum_amount;
    minimum.min_amount = min_amount;

    Ok(())
}

#[derive(Accounts)]
pub struct AddMinimumAmount<'info> {
    #[account(mut, has_one = initializer)]
    pub escrow: Account<'info, Escrow>,

    #[account(
      init,
      payer = initializer,
      space = ANCHOR_DISCRIMINATOR + MinimumAmount::INIT_SPACE,
      seeds = [b"minimum_amount", escrow.key().as_ref()],
      bump
    )]
    pub minimum_amount: Account<'info, MinimumAmount>,

    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}