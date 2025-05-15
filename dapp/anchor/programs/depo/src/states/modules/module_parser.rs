use crate::errors::ReleaseErrors;
use crate::states::modules::target_amount::TargetAmount;
use crate::states::modules::timelock::Timelock;
use crate::states::{ConditionModule, MinimumAmount, ModuleType};
use anchor_lang::prelude::*;

pub fn parse_module<'a, 'info>(
    module_type: &ModuleType,
    account: &'a AccountInfo<'info>,
) -> Result<ConditionModule>
where
    'a: 'info,
{
    match module_type {
        ModuleType::MinimumAmount => {
            let parsed = Account::<'info, MinimumAmount>::try_from_unchecked(account)?;
            Ok(ConditionModule::MinimumAmount(parsed.into_inner()))
        }
        ModuleType::TargetAmount => {
            let parsed = Account::<'info, TargetAmount>::try_from_unchecked(account)?;
            Ok(ConditionModule::TargetAmount(parsed.into_inner()))
        }
        ModuleType::Timelock => {
            let parsed = Account::<'info, Timelock>::try_from_unchecked(account)?;
            Ok(ConditionModule::Timelock(parsed.into_inner()))
        }
        // TODO: Add other module types as they are implemented
        _ => err!(ReleaseErrors::UnsupportedModule),
    }
}
