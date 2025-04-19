use crate::constants::ANCHOR_DISCRIMINATOR;
use crate::errors::{EscrowErrors, TimelockErrors};
use crate::states::{Escrow, ModuleReference, ModuleType, Status, Timelock};
use anchor_lang::prelude::*;

/// Add a timelock condition to the escrow
///
/// # Arguments
/// * `ctx` - The context containing the escrow account and signer (the initializer of the escrow)
/// * `release_after` - The unix timestamp representing when the condition is met
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn add_timelock(
    ctx: Context<AddTimelock>,
    _escrow_id: [u8; 16],
    release_after: u64,
) -> Result<()> {
    let clock = Clock::get()?;
    let now = clock.unix_timestamp as u64;

    require!(release_after > now, TimelockErrors::InvalidReleaseAfter);

    let escrow = &mut ctx.accounts.escrow;

    require!(escrow.status == Status::Draft, EscrowErrors::EscrowNotDraft);

    require!(
        !escrow
            .modules
            .iter()
            .any(|m| m.module_type == ModuleType::Timelock),
        EscrowErrors::ModuleAlreadyExists
    );

    escrow.modules.push(ModuleReference {
        module_type: ModuleType::Timelock,
        key: ctx.accounts.timelock.key(),
    });

    let timelock = &mut ctx.accounts.timelock;
    timelock.release_after = release_after;

    Ok(())
}

#[derive(Accounts)]
#[instruction(escrow_id: [u8; 16])]
pub struct AddTimelock<'info> {
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
      space = ANCHOR_DISCRIMINATOR + Timelock::INIT_SPACE,
      seeds = [b"timelock", escrow.key().as_ref()],
      bump
    )]
    pub timelock: Account<'info, Timelock>,

    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
