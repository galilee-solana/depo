import { BN } from "@coral-xyz/anchor";

/**
 * Format a timestamp BN into a readable date and time string
 * @param timestamp - The timestamp to format
 * @returns The formatted timestamp
 */
export function formatTimestamp(timestamp: BN): string {
  const date = new Date(timestamp.toNumber() * 1000);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  };
  return date.toLocaleString(undefined, options);
}