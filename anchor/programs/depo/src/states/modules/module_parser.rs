use anchor_lang::prelude::*;
use crate::states::{ModuleType, MinimumAmount, ConditionModule};
use crate::errors::ReleaseErrors;

pub fn parse_module<'a, 'info>(
  module_type: &ModuleType,
  account: &'a AccountInfo<'info>,
) -> Result<ConditionModule<'info>> 
where
  'a: 'info,
{
  match module_type {
      ModuleType::MinimumAmount => {
        let parsed = Account::<'info, MinimumAmount>::try_from_unchecked(account)?;
        Ok(ConditionModule::MinimumAmount(parsed))
      }
      // TODO: Add other module types as they are implemented
      _ => err!(ReleaseErrors::UnsupportedModule),
  }
}
