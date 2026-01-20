import type { StandardSchemaV1 } from "@standard-schema/spec";
import { z } from "zod";
import * as v from "valibot";
import { type } from "arktype";

// All three libraries implement StandardSchemaV1
// This means any tool that accepts StandardSchemaV1 works with all of them!

const zodSchema = z.object({ name: z.string() });
const valibotSchema = v.object({ name: v.string() });
const arktypeSchema = type({ name: "string" });

// A library author (tRPC, TanStack, Hono, etc.) only needs to write ONE function:
async function validateWithStandardSchema<T>(
  schema: StandardSchemaV1<unknown, T>,
  data: unknown,
): Promise<{ success: true; data: T } | { success: false; issues: string[] }> {
  const result = await schema["~standard"].validate(data);

  if (result.issues) {
    return {
      success: false,
      issues: result.issues.map((i) => i.message),
    };
  }

  return { success: true, data: result.value as T };
}

// Now it works with ANY schema library that implements Standard Schema:
async function demo() {
  const testData = { name: "Alice" };

  // Same function works with Zod
  const zodResult = await validateWithStandardSchema(zodSchema, testData);
  console.log("Zod:", zodResult);

  // Same function works with Valibot
  const valibotResult = await validateWithStandardSchema(
    valibotSchema,
    testData,
  );
  console.log("Valibot:", valibotResult);

  // Same function works with Arktype
  const arktypeResult = await validateWithStandardSchema(
    arktypeSchema,
    testData,
  );
  console.log("Arktype:", arktypeResult);
}

demo();
