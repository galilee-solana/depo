#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

pub mod constants;
pub mod instructions;
pub mod states;
pub mod errors;
pub mod utils;

use instructions::*;

#[program]
pub mod depo {
    use super::*;

    pub fn create_escrow(
        ctx: Context<CreateEscrowCtx>,
        escrow_id: [u8; 16],
        name: Vec<u8>,
        description: Vec<u8>
    ) -> Result<()> {
        instructions::create_escrow(ctx, escrow_id, name, description)
    }

    pub fn add_recipient(
        ctx: Context<AddRecipientCtx>,
        escrow_id: [u8; 16]
    ) -> Result<()> {
        instructions::add_recipient(ctx, escrow_id)
    }
}