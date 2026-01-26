/**
 * Mini Validator - A tiny validation library to learn the fundamentals
 *
 * How validation libraries work:
 * 1. Schema = object with a `parse(input) => Result` method
 * 2. Result = { success: true, data: T } | { success: false, errors: string[] }
 * 3. Type inference via TypeScript generics
 */

// ============================================================================
// Result Types
// ============================================================================

type Success<T> = { success: true; data: T };
type Failure = { success: false; errors: string[] };
type Result<T> = Success<T> | Failure;

// ============================================================================
// Schema Interface
// ============================================================================

interface Schema<T> {
  parse(input: unknown): Result<T>;
}

// ============================================================================
// Type Inference Helper
// ============================================================================

/**
 * Extracts the TypeScript type from a schema.
 * This is the "magic" - you define a schema and get the type for free!
 */
export type Infer<S> = S extends Schema<infer T> ? T : never;

// ============================================================================
// Helper Function
// ============================================================================

function getType(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

// ============================================================================
// Primitive Validators - TODO: Implement these!
// ============================================================================

function string(): Schema<string> {
  return {
    parse(input: unknown): Result<string> {
      // TODO: Return success if input is a string, failure otherwise
      return { success: false, errors: ["Not implemented"] };
    },
  };
}

function number(): Schema<number> {
  return {
    parse(input: unknown): Result<number> {
      // TODO: Return success if input is a number, failure otherwise
      return { success: false, errors: ["Not implemented"] };
    },
  };
}

function boolean(): Schema<boolean> {
  return {
    parse(input: unknown): Result<boolean> {
      // TODO: Return success if input is a boolean, failure otherwise
      return { success: false, errors: ["Not implemented"] };
    },
  };
}

// ============================================================================
// Object Validator - TODO: Implement this!
// ============================================================================

/**
 * This type maps an object of schemas to an object of their inferred types.
 * { name: Schema<string>, age: Schema<number> } => { name: string, age: number }
 */
type InferObject<T extends Record<string, Schema<unknown>>> = {
  [K in keyof T]: Infer<T[K]>;
};

function object<T extends Record<string, Schema<unknown>>>(
  shape: T,
): Schema<InferObject<T>> {
  return {
    parse(input: unknown): Result<InferObject<T>> {
      // TODO: Implement object validation
      // 1. Check if input is an object (not null, not array)
      // 2. Validate each field using its schema
      // 3. Collect all errors with field names: "fieldName: error message"
      // 4. Return success with data or failure with all errors
      return { success: false, errors: ["Not implemented"] };
    },
  };
}

// ============================================================================
// Export the validator namespace
// ============================================================================

export const v = {
  string,
  number,
  boolean,
  object,
};
