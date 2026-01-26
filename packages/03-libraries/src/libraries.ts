/**
 * Validation Libraries Exercise
 *
 * Implement schemas using three popular validation libraries.
 * All three achieve the same goal: Runtime validation + Type inference
 */

import { z } from "zod";
import * as v from "valibot";
import { type } from "arktype";

// ============================================================================
// The User type we want to validate
// ============================================================================

export type User = {
  name: string;
  email: string;
  age: number;
};

// ============================================================================
// Exercise 1: Zod Schema
// ============================================================================

/**
 * TODO: Create a Zod schema for User
 *
 * Requirements:
 * - name: string
 * - email: string, must be valid email format
 * - age: number, minimum 0, maximum 150
 *
 * Hint: z.object({ ... }), z.string().email(), z.number().min().max()
 */
export const zodUserSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  age: z.number().min(0).max(150),
});

// ============================================================================
// Exercise 2: Valibot Schema
// ============================================================================

/**
 * TODO: Create a Valibot schema for User
 *
 * Requirements:
 * - name: string
 * - email: string, must be valid email format
 * - age: number, minimum 0, maximum 150
 *
 * Hint: v.object({ ... }), v.pipe(v.string(), v.email()), v.pipe(v.number(), v.minValue(), v.maxValue())
 */
export const valibotUserSchema = v.object({
  name: v.string(),
  email: v.pipe(v.string(), v.email()),
  age: v.pipe(v.number(), v.minValue(0), v.maxValue(150)),
});

// ============================================================================
// Exercise 3: ArkType Schema
// ============================================================================

/**
 * TODO: Create an ArkType schema for User
 *
 * Requirements:
 * - name: string
 * - email: string (basic string, email validation is advanced)
 * - age: number, minimum 0, maximum 150
 *
 * Hint: type({ name: "string", age: "0 <= number <= 150" })
 */
export const arktypeUserSchema = type({
  name: "string",
  email: "string",
  age: "0 <= number <= 150",
});
