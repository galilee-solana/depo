use crate::errors::TimelockErrors;
use crate::states::Escrow;
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Timelock {
    // Unix timestamp
    pub release_after: u64,
}

impl Timelock {
    pub fn is_satisfied(&self, _: &Escrow) -> Result<()> {
        let clock = Clock::get()?;
        let now = clock.unix_timestamp as u64;

        require!(
            now >= self.release_after,
            TimelockErrors::TimelockNotExpired
        );

        Ok(())
    }
}
