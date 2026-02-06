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
    const body = await c.req.json();

    // Validate request body
    const parsed = CheckFlagRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.message }, 400);
    }

    const { flagName, userId } = parsed.data;

    // Check flag
    const result = client.isEnabled(flagName, { userId });
    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ enabled: result.data }, 200);
  });

  return app;
}
