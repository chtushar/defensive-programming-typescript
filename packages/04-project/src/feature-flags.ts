/**
 * Feature Flags API
 *
 * This exercise ties together all defensive programming concepts:
 * - Trust boundaries (unknown external data)
 * - Runtime validation (Zod schemas)
 * - Type inference (types from schemas)
 * - Result types (never throw, return errors)
 * - Discriminated unions (type narrowing)
 */

import { z } from "zod";

// ============================================================================
// Result Types
// ============================================================================

type Success<T> = { success: true; data: T };
type Failure = { success: false; error: string };
type Result<T> = Success<T> | Failure;

// ============================================================================
// Zod Schemas - Define once, get validation + types
// ============================================================================

const BooleanFlagSchema = z.object({
  kind: z.literal("boolean"),
  name: z.string(),
  enabled: z.boolean(),
});

const PercentageFlagSchema = z.object({
  kind: z.literal("percentage"),
  name: z.string(),
  percentage: z.number().min(0).max(100),
});

const UserTargetFlagSchema = z.object({
  kind: z.literal("user-target"),
  name: z.string(),
  allowedUserIds: z.array(z.string()),
});

const FeatureFlagSchema = z.discriminatedUnion("kind", [
  BooleanFlagSchema,
  PercentageFlagSchema,
  UserTargetFlagSchema,
]);

const FlagConfigSchema = z.array(FeatureFlagSchema);

// ============================================================================
// Inferred Types - The magic!
// ============================================================================

export type FeatureFlag = z.infer<typeof FeatureFlagSchema>;
export type FlagConfig = z.infer<typeof FlagConfigSchema>;

export type EvaluationContext = {
  userId: string;
};

// ============================================================================
// Helper: Hash user ID to 0-99 for percentage rollouts
// ============================================================================

function hashUserId(userId: string): number {
  let hash = 0;
  for (const char of userId) {
    hash = (hash * 31 + char.charCodeAt(0)) % 100;
  }
  return hash;
}

// ============================================================================
// Exercise 1: Parse External Configuration (Trust Boundary)
// ============================================================================

/**
 * TODO: Implement this function.
 *
 * Parse and validate flag configuration from external data.
 * This is the trust boundary - external data is untrusted!
 *
 * Requirements:
 * - Use FlagConfigSchema.safeParse(data)
 * - Return { success: true, data } on valid input
 * - Return { success: false, error } on invalid input
 *
 * Hint: safeParse returns { success, data, error }
 */
export function parseConfig(data: unknown): Result<FlagConfig> {
  // TODO: Implement
  return { success: false, error: "Not implemented" };
}

// ============================================================================
// Exercise 2: Evaluate Feature Flag (Type Narrowing)
// ============================================================================

/**
 * TODO: Implement this function.
 *
 * Evaluate if a flag is enabled for the given context.
 *
 * Requirements:
 * - "boolean" flag: return the `enabled` value
 * - "percentage" flag: return true if hashUserId(userId) < percentage
 * - "user-target" flag: return true if userId is in allowedUserIds
 *
 * Hint: Use switch(flag.kind) for exhaustive type narrowing
 */
export function evaluateFlag(
  flag: FeatureFlag,
  context: EvaluationContext,
): boolean {
  // TODO: Implement using switch(flag.kind)
  return false;
}

// ============================================================================
// Exercise 3: Feature Flags Client (Integration)
// ============================================================================

/**
 * TODO: Implement this class.
 *
 * A client that ties everything together:
 * 1. Parses config from external source (trust boundary)
 * 2. Stores validated flags
 * 3. Provides type-safe flag evaluation
 */
export class FeatureFlagsClient {
  private flags: Map<string, FeatureFlag> = new Map();
  private configError: string | null = null;

  constructor(configData: unknown) {
    // TODO: Parse configData using parseConfig()
    // If success: store flags in the Map by name
    // If failure: store the error message
  }

  /**
   * Check if a flag is enabled for the given context.
   *
   * Returns:
   * - { success: true, data: boolean } if flag exists
   * - { success: false, error } if config invalid or flag not found
   */
  isEnabled(flagName: string, context: EvaluationContext): Result<boolean> {
    // TODO: Implement
    // 1. If configError exists, return failure
    // 2. If flag not found, return failure with flag name
    // 3. Otherwise, evaluate and return success
    return { success: false, error: "Not implemented" };
  }
}
