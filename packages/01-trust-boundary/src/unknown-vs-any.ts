/**
 * Exercise: unknown vs any
 *
 * `any` disables type checking - TypeScript won't catch errors
 * `unknown` requires type narrowing before use - TypeScript ensures safety
 */

// ============================================================================
// Exercise 1: The danger of `any`
// ============================================================================

/**
 * This function uses `any` - it compiles but crashes at runtime!
 * DO NOT FIX THIS - it demonstrates why `any` is dangerous.
 */
export function getNameUnsafe(data: any): string {
  // This compiles fine, but will crash if data is null/undefined
  return data.name.toUpperCase();
}

// ============================================================================
// Exercise 2: Safe access with `unknown`
// ============================================================================

/**
 * TODO: Implement this function safely.
 *
 * Given an unknown value, return the uppercase name if:
 * - value is an object (not null)
 * - value has a 'name' property that is a string
 *
 * Otherwise, return null.
 *
 * Hint: Use typeof checks and the 'in' operator for narrowing.
 */
export function getNameSafe(data: unknown): string | null {
  // Your implementation here
  return null;
}

// ============================================================================
// Exercise 3: Narrowing unknown values
// ============================================================================

/**
 * TODO: Implement this function to handle different types.
 *
 * Given an unknown value, return:
 * - If string: the string in UPPERCASE
 * - If number: the number formatted to 2 decimal places (as string)
 * - If Error: the error message
 * - Otherwise: null
 *
 * Hint: Use typeof for primitives, instanceof for Error
 */
export function processValue(value: unknown): string | null {
  // Your implementation here
  return null;
}
