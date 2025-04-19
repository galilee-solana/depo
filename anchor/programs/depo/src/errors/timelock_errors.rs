use anchor_lang::prelude::*;

#[error_code]
pub enum TimelockErrors {
    #[msg("Timelock not expired yet")]
    TimelockNotExpired,
    #[msg("release_after should be after now")]
    InvalidReleaseAfter
}
