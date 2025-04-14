use anchor_lang::prelude::*;
use crate::states::{ModuleType, MinimumAmount, ModuleCondition};
use crate::errors::ReleaseErrors;

pub fn parse_module<'a, 'info>(
  module_type: &ModuleType,
  account: &'a AccountInfo<'info>,
) -> Result<ModuleCondition<'info>> 
where
  'a: 'info,
{
  match module_type {
      ModuleType::MinimumAmount => {
        let parsed = Account::<'info, MinimumAmount>::try_from_unchecked(account)?;
        Ok(ModuleCondition::MinimumAmount(parsed))
      }
      _ => err!(ReleaseErrors::UnsupportedModule),
  }
}
