/**
 * Utility for working with Anchor enums in TypeScript
 */

// Status enum (matching the Rust enum in status.rs)
export enum EscrowStatus {
  DRAFT = 'draft',
  STARTED = 'started',
  RELEASED = 'released',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired'
}

// ModuleType enum (matching the Rust enum in module_type.rs)
export enum ModuleType {
  TIME_LOCK = 'timeLock',
  EXPIRY_FALLBACK = 'expiryFallback',
  SINGLE_APPROVAL = 'singleApproval',
  MULTISIG_APPROVAL = 'multisigApproval',
  TARGET_AMOUNT = 'targetAmount',
  MINIMUM_AMOUNT = 'minimumAmount'
}

/**
 * Parse an Anchor-serialized enum into TypeScript enum value
 * 
 * @param enumObj The Anchor enum object (e.g., { draft: {} })
 * @param enumType Reference to the TypeScript enum type
 * @param defaultValue Default value if parsing fails
 * @returns The matched enum value
 */
export function parseAnchorEnum<T extends Record<string, string>>(
  enumObj: any, 
  enumType: T,
  defaultValue: string
): string {
  if (!enumObj) return defaultValue;

  // Get the key from the Anchor enum object
  const key = Object.keys(enumObj)[0];
  if (!key) return defaultValue;

  // Find the matching enum value
  const values = Object.values(enumType);
  for (const value of values) {
    if (value.toLowerCase() === key.toLowerCase()) {
      return value;
    }
  }

  return defaultValue;
}

/**
 * Creates an Anchor-compatible enum object from a TypeScript enum value
 * 
 * @param value The TypeScript enum value
 * @returns An object in the format Anchor expects (e.g., { draft: {} })
 */
export function createAnchorEnum(value: string): Record<string, Record<string, never>> {
  // Convert to lowercase and create an empty object as the value
  return { [value.toLowerCase()]: {} };
}

/**
 * Helper to check if an Anchor enum matches a specific variant
 * 
 * @param enumObj The Anchor enum object
 * @param variant The variant name to check
 * @returns true if the enum matches the variant
 */
export function isAnchorEnumVariant(enumObj: any, variant: string): boolean {
  if (!enumObj) return false;
  return enumObj[variant.toLowerCase()] !== undefined;
} 