#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod deposit {
    use super::*;

  pub fn close(_ctx: Context<CloseDeposit>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.deposit.count = ctx.accounts.deposit.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.deposit.count = ctx.accounts.deposit.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeDeposit>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.deposit.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeDeposit<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Deposit::INIT_SPACE,
  payer = payer
  )]
  pub deposit: Account<'info, Deposit>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseDeposit<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub deposit: Account<'info, Deposit>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub deposit: Account<'info, Deposit>,
}

#[account]
#[derive(InitSpace)]
pub struct Deposit {
  count: u8,
}
