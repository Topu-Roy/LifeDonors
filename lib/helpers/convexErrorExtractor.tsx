/**
 * Extracts the error message from a Convex error.
 * @param err The error to extract the message from.
 * @returns The error message.
 */
export const extractConvexError = (err: Error): string => {
  return err.message
    .replace(/^\[CONVEX M\([^)]+\)\]\s*\[Request ID: [a-f0-9]+\]\s*Server Error\s*/i, "")
    .replace(/^Uncaught Error:\s*/, "")
    .trim();
};
