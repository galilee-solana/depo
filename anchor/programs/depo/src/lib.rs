#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

pub mod instructions;
pub mod states;

use instructions::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

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