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
      if (typeof input === "string") {
        return { success: true, data: input };
      }
      return { success: false, errors: [`Expected string, got ${getType(input)}`] };
    },
  };
}

function number(): Schema<number> {
  return {
    parse(input: unknown): Result<number> {
      if (typeof input === "number") {
        return { success: true, data: input };
      }
      return { success: false, errors: [`Expected number, got ${getType(input)}`] };
    },
  };
}

function boolean(): Schema<boolean> {
  return {
    parse(input: unknown): Result<boolean> {
      if (typeof input === "boolean") {
        return { success: true, data: input };
      }
      return { success: false, errors: [`Expected boolean, got ${getType(input)}`] };
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
      if (typeof input !== "object" || input === null || Array.isArray(input)) {
        return { success: false, errors: [`Expected object, got ${getType(input)}`] };
      }

      const errors: string[] = [];
      const data = {} as InferObject<T>;
      const inputObj = input as Record<string, unknown>;

      for (const [key, schema] of Object.entries(shape)) {
        const result = schema.parse(inputObj[key]);
        if (result.success) {
          (data as Record<string, unknown>)[key] = result.data;
        } else {
          errors.push(...result.errors.map((e) => `${key}: ${e}`));
        }
      }

      if (errors.length > 0) {
        return { success: false, errors };
      }

      return { success: true, data };
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
