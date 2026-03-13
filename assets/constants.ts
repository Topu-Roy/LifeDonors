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
