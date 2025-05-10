/**
 * Utilities for handling Solana number formatting and validation
 */

import { BN } from '@coral-xyz/anchor'

/**
 * Validates if a string is a valid decimal number
 * @param value The string to validate
 * @returns True if the string is a valid decimal number
 */
export function isValidDecimalNumber(value: string): boolean {
  return value === '' || /^[0-9]*\.?[0-9]*$/.test(value)
}

/**
 * Converts a SOL amount (as string) to lamports (as BN)
 * @param solAmount The SOL amount as a string
 * @returns A BN representing the lamports
 */
export function solToBN(solAmount: string): BN | null {
  if (!solAmount || solAmount === '') return null
  
  try {
    const sol = parseFloat(solAmount)
    if (isNaN(sol)) return null
    
    const lamports = Math.round(sol * 1_000_000_000)
    return new BN(lamports)
  } catch (error) {
    console.error('Error converting SOL to lamports:', error)
    return null
  }
}

/**
 * Converts lamports (as BN or number) to SOL (as string)
 * @param lamports The lamports as BN or number
 * @returns A string representing the SOL amount
 */
export function lamportsToSol(lamports: BN | number | string): string {
  if (!lamports) return '0'
  
  try {
    let lamportsNumber: number
    
    if (typeof lamports === 'string') {
      lamportsNumber = parseInt(lamports)
    } else if (BN.isBN(lamports)) {
      lamportsNumber = lamports.toNumber()
    } else {
      lamportsNumber = lamports
    }
    
    if (isNaN(lamportsNumber)) return '0'
    
    return (lamportsNumber / 1_000_000_000).toString()
  } catch (error) {
    console.error('Error converting lamports to SOL:', error)
    return '0'
  }
}

/**
 * Formats a SOL amount for display
 * @param solAmount The SOL amount as a string or number
 * @param decimals The number of decimal places to show
 * @returns A formatted string for display
 */
export function formatSol(solAmount: string | number, decimals: number = 4): string {
  if (!solAmount) return '0'
  
  try {
    const amount = typeof solAmount === 'string' ? parseFloat(solAmount) : solAmount
    if (isNaN(amount)) return '0'
    
    return amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals
    })
  } catch (error) {
    console.error('Error formatting SOL amount:', error)
    return '0'
  }
} 