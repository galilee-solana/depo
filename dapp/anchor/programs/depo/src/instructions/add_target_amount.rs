use anchor_lang::prelude::*;
use crate::states::{Escrow, ModuleReference, ModuleType, Status, TargetAmount};
use crate::constants::ANCHOR_DISCRIMINATOR;
use crate::errors::{EscrowErrors, TargetAmountErrors};


/// Add a target amount condition to the escrow
///
/// # Arguments
/// * `ctx` - The context containing the escrow account and signer (the initializer of the escrow)
/// * `target_amount` - The target amount required to fulfill the condition
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn add_target_amount(
    ctx: Context<AddTargetAmount>,
    _escrow_id: [u8; 16],
    target_amount: u64
) -> Result<()> {
    require!(target_amount > 0, TargetAmountErrors::TargetAmountGreaterThanZero);

    let escrow = &mut ctx.accounts.escrow;

    require!(escrow.status == Status::Draft, EscrowErrors::EscrowNotDraft);

    require!(
        !escrow.modules.iter().any(|m| m.module_type == ModuleType::TargetAmount), 
        EscrowErrors::ModuleAlreadyExists
    );

    escrow.modules.push(ModuleReference {
        module_type: ModuleType::TargetAmount,
        key: ctx.accounts.target_amount.key(),
    });

    let target = &mut ctx.accounts.target_amount;
    target.target_amount = target_amount;

    Ok(())
}

#[derive(Accounts)]
#[instruction(escrow_id: [u8; 16])]
pub struct AddTargetAmount<'info> {
    #[account(
        mut,
        seeds = [b"escrow", escrow_id.as_ref()],
        bump,
        has_one = initializer
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(
      init,
      payer = initializer,
      space = ANCHOR_DISCRIMINATOR + TargetAmount::INIT_SPACE,
      seeds = [b"target_amount", escrow.key().as_ref()],
      bump
    )]
    pub target_amount: Account<'info, TargetAmount>,

    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}