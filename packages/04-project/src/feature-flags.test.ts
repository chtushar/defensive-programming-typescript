import { describe, it, expect } from "vitest";
import {
  parseConfig,
  evaluateFlag,
  FeatureFlagsClient,
  type FeatureFlag,
} from "./feature-flags";

describe("parseConfig - Trust Boundary", () => {
  it("validates external configuration", () => {
    const validConfig = [
      { kind: "boolean", name: "dark-mode", enabled: true },
      { kind: "percentage", name: "new-feature", percentage: 50 },
      { kind: "user-target", name: "beta", allowedUserIds: ["user-1"] },
    ];

    const result = parseConfig(validConfig);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(3);
    }

    // Invalid config should fail
    const invalidConfig = [{ kind: "boolean", name: "test" }]; // missing enabled
    const invalidResult = parseConfig(invalidConfig);
    expect(invalidResult.success).toBe(false);
  });
});

describe("evaluateFlag - Type Narrowing", () => {
  it("evaluates different flag types", () => {
    const context = { userId: "user-123" };

    // Boolean flag
    const boolFlag: FeatureFlag = {
      kind: "boolean",
      name: "test",
      enabled: true,
    };
    expect(evaluateFlag(boolFlag, context)).toBe(true);

    // User target - in list
    const targetFlag: FeatureFlag = {
      kind: "user-target",
      name: "beta",
      allowedUserIds: ["user-123"],
    };
    expect(evaluateFlag(targetFlag, context)).toBe(true);

    // User target - not in list
    const notInList: FeatureFlag = {
      kind: "user-target",
      name: "beta",
      allowedUserIds: ["other-user"],
    };
    expect(evaluateFlag(notInList, context)).toBe(false);
  });
});

describe("FeatureFlagsClient - Integration", () => {
  it("creates client and evaluates flags", () => {
    const config = [
      { kind: "boolean", name: "feature-a", enabled: true },
      { kind: "user-target", name: "feature-b", allowedUserIds: ["vip"] },
    ];

    const client = new FeatureFlagsClient(config);

    // Feature A is enabled for everyone
    const resultA = client.isEnabled("feature-a", { userId: "anyone" });
    expect(resultA).toEqual({ success: true, data: true });

    // Feature B only for VIP
    const resultB = client.isEnabled("feature-b", { userId: "vip" });
    expect(resultB).toEqual({ success: true, data: true });

    // Non-VIP doesn't get feature B
    const resultC = client.isEnabled("feature-b", { userId: "regular" });
    expect(resultC).toEqual({ success: true, data: false });

    // Unknown flag returns failure
    const resultD = client.isEnabled("unknown", { userId: "anyone" });
    expect(resultD.success).toBe(false);
  });
});
