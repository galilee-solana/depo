use anchor_lang::prelude::*;
use crate::errors::GeneralErrors;

/// Converts a vector to a fixed size array
/// 
/// # Arguments
/// * `vec` - The vector to convert
/// * `N` - The size of the fixed size array
/// 
/// # Returns
/// * `Result<[u8; N], GeneralErrors>` - The fixed size array
pub fn vec_to_fixed_size<const N: usize>(vec: Vec<u8>) -> anchor_lang::Result<[u8; N]> {
  require!(vec.len() <= N, GeneralErrors::InvalidVectorLength);
  let mut array = [0u8; N];
  array[..vec.len()].copy_from_slice(&vec);
  Ok(array)
}