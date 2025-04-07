#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

pub mod constants;
pub mod instructions;
pub mod states;

use instructions::*;

#[program]
pub mod depo {
    use super::*;

    pub fn create_escrow(
        ctx: Context<CreateEscrowCtx>,
        escrow_id: [u8; 16],
        name: [u8; 100],
        description: [u8; 200]
    ) -> Result<()> {
        instructions::create_escrow(ctx, escrow_id, name, description)
    }
}