export const COMPATIBILITY_MAP: Record<string, string[]> = {
  "A+": ["A+", "AB+"],
  "O+": ["O+", "A+", "B+", "AB+"],
  "B+": ["B+", "AB+"],
  "AB+": ["AB+"],
  "A-": ["A+", "A-", "AB+", "AB-"],
  "O-": ["A+", "O+", "B+", "AB+", "A-", "O-", "B-", "AB-"],
  "B-": ["B+", "B-", "AB+", "AB-"],
  "AB-": ["AB+", "AB-"],
};

/**
 * Checks if a donor with a certain blood type can give to a recipient with a certain blood type.
 * @param donorType The blood type of the donor.
 * @param recipientType The blood type needed by the recipient.
 * @returns True if compatible, false otherwise.
 */
export function isCompatible(donorType: string | undefined, recipientType: string): boolean {
  if (!donorType) return true; // Assume true if we don't know the donor's type (allow them to try)
  return COMPATIBILITY_MAP[donorType]?.includes(recipientType) ?? false;
}
