use anchor_lang::prelude::*;
use crate::states::{Escrow, Status, ModuleCondition, validate_module_conditions};
use crate::errors::{EscrowErrors, ReleaseErrors, GeneralErrors};
use crate::utils::parse_module;

/// Releases the escrow 
///
/// # Arguments
/// * `ctx` - The context containing the escrow account and signer
/// * `escrow_id` - Unique identifier for the escrow (16 byte UUID)
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn release_escrow<'a, 'b, 'c, 'info>(
    ctx: Context<'a, 'b, 'c, 'info, ReleaseEscrow<'info>>,
    _escrow_id: [u8; 16],
) -> Result<()> 
where
    'c: 'info,
{
    let escrow = &mut ctx.accounts.escrow;
    require!(escrow.status == Status::Started, EscrowErrors::EscrowNotStarted);

    require!(
        ctx.remaining_accounts.len() == escrow.modules.len(),
        ReleaseErrors::InvalidNumberOfAccounts
    );

    let mut condition_modules: Vec<ModuleCondition<'info>> = Vec::new();
    let mut processed_modules: Vec<bool> = vec![false; escrow.modules.len()];

    for i in 0..ctx.remaining_accounts.len() {
        let account = &ctx.remaining_accounts[i];
        require!(
            account.owner == ctx.program_id,
            GeneralErrors::InvalidAccountOwner
        );

        let module_idx = escrow.modules.iter()
            .position(|m| m.key == account.key())
            .ok_or(ReleaseErrors::ModuleNotFound)?;

        require!(!processed_modules[module_idx], ReleaseErrors::ModuleAlreadyAdded);

        processed_modules[module_idx] = true;        
        
        let module_type = &escrow.modules[module_idx].module_type;
        let module_condition = parse_module(module_type, account)?;
        condition_modules.push(module_condition);
    }

    if let Err(_) = validate_module_conditions(escrow, &condition_modules) {
        return err!(ReleaseErrors::ValidationFailed);
    }
    
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
      has_one = initializer // TODO: Remove this constraint
      // TODO: Add a constraint to an admin account 
      //       to release the escrow periodically with a cron job
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub initializer: Signer<'info>,
    pub system_program: Program<'info, System>,
}