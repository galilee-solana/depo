use anchor_lang::prelude::*;
use crate::states::{Escrow, Status, ConditionModule, ModuleType, MinimumAmount};
use crate::errors::{EscrowErrors, ReleaseErrors, GeneralErrors};
use crate::states::validate_escrow_conditions;

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

    require!(
        ctx.remaining_accounts.len() == escrow.modules.len(),
        ReleaseErrors::InvalidNumberOfAccounts
    );

    let mut condition_modules: Vec<Box<dyn ConditionModule>> = Vec::new();
    let mut processed_modules: Vec<bool> = vec![false; escrow.modules.len()];

    for account in ctx.remaining_accounts {
        require!(
            account.owner == ctx.program_id,
            GeneralErrors::InvalidAccountOwner
        );

        let module_idx = escrow.modules.iter()
            .position(|m| m.key == account.key())
            .ok_or(ReleaseErrors::ModuleNotFound)?;

        require!(!processed_modules[module_idx], ReleaseErrors::ModuleAlreadyAdded);

        processed_modules[module_idx] = true;        
        
        match escrow.modules[module_idx].module_type {
            ModuleType::MinimumAmount => {
                let minimum_amount = Account::<MinimumAmount>::try_from(account)?;
                condition_modules.push(Box::new(minimum_amount));
            },
            // Add other module types as they get implemented
            _ => return err!(ReleaseErrors::UnsupportedModule)
        }
    }

    let module_refs: Vec<&dyn ConditionModule> = condition_modules.iter()
        .map(|m| m.as_ref())
        .collect();

    if let Err(err) = validate_escrow_conditions(escrow, &module_refs) {
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