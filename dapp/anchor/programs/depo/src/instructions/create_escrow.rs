use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;
use crate::states::{Escrow, Status};
use crate::constants::{ANCHOR_DISCRIMINATOR, MAX_PERCENTAGE};
use crate::errors::EscrowErrors;
use crate::utils::vec_to_fixed_size;

/// Creates a new escrow account with the given parameters
///
/// # Arguments
/// * `ctx` - The context containing the escrow account and signer
/// * `escrow_id` - Unique identifier for the escrow (16 byte UUID)
/// * `name` - Name of the escrow (100 bytes max)
/// * `description` - Description of the escrow (200 bytes max)
///
/// # Returns
/// * `Result<()>` - Result indicating success or failure
pub fn create_escrow(
    ctx: Context<CreateEscrow>,
    escrow_id: [u8; 16],
    name: Vec<u8>,
    description: Vec<u8>
) -> Result<()> {
    require!(name.len() <= 100, EscrowErrors::NameTooLong);
    require!(description.len() <= 200, EscrowErrors::DescriptionTooLong);


    let escrow = &mut ctx.accounts.escrow;
    escrow.id = escrow_id;
    escrow.initializer = ctx.accounts.signer.key();

    escrow.name = vec_to_fixed_size::<100>(name)?;
    escrow.description = vec_to_fixed_size::<200>(description)?;

    escrow.deposited_amount = 0;
    escrow.withdrawn_amount = 0;
    escrow.remaining_percentage = MAX_PERCENTAGE; 
        
    escrow.is_public_deposit = true;
    escrow.depositors_count = 0;
    escrow.recipients_count = 0;

    escrow.status = Status::Draft;
    escrow.modules = Vec::new();

    escrow.created_at = Clock::get()?.unix_timestamp;
    Ok(())
}

#[derive(Accounts)]
#[instruction(escrow_id: [u8; 16])]
pub struct CreateEscrow<'info> {
    #[account(
      init,
      payer = signer,
      space = ANCHOR_DISCRIMINATOR + Escrow::INIT_SPACE,
      seeds = [b"escrow", escrow_id.as_ref()],
      bump
    )]
    pub escrow: Account<'info, Escrow>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}