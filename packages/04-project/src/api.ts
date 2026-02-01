/**
 * Feature Flags HTTP API
 *
 * Demonstrates trust boundaries in a real-world scenario:
 * - HTTP request body is untrusted external data
 * - Validate with Zod before processing
 * - Return proper HTTP responses
 */

import { Hono } from "hono";
import { z } from "zod";
import { FeatureFlagsClient } from "./feature-flags";

// ============================================================================
// Request Validation Schema
// ============================================================================

const CheckFlagRequestSchema = z.object({
  flagName: z.string(),
  userId: z.string(),
});

export type CheckFlagRequest = z.infer<typeof CheckFlagRequestSchema>;

// ============================================================================
// Create API with Feature Flags Client
// ============================================================================

export function createApi(configData: unknown) {
  const client = new FeatureFlagsClient(configData);
  const app = new Hono();

  /**
   * POST /flags/check
   *
   * Check if a feature flag is enabled for a user.
   *
   * Request body: { flagName: string, userId: string }
   * Response: { enabled: boolean } or { error: string }
   */
  app.post("/flags/check", async (c) => {
    // TODO: Implement this endpoint
    //
    // 1. Get request body with c.req.json()
    // 2. Validate with CheckFlagRequestSchema.safeParse()
    // 3. If validation fails, return 400 with error
    // 4. Call client.isEnabled(flagName, { userId })
    // 5. If client returns failure, return 400 with error
    // 6. Return 200 with { enabled: boolean }
    //
    // Hint: Use c.json({ ... }, statusCode) to return JSON responses

    return c.json({ error: "Not implemented" }, 501);
  });

  return app;
}
