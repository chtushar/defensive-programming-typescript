import { describe, it, expect } from "vitest";
import { createApi } from "./api";

const validConfig = [
  { kind: "boolean", name: "dark-mode", enabled: true },
  { kind: "user-target", name: "beta", allowedUserIds: ["vip-user"] },
];

describe("Feature Flags API", () => {
  it("returns enabled status for valid request", async () => {
    const app = createApi(validConfig);

    const res = await app.request("/flags/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flagName: "dark-mode", userId: "any-user" }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toEqual({ enabled: true });
  });

  it("returns 400 for invalid request body", async () => {
    const app = createApi(validConfig);

    const res = await app.request("/flags/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flagName: 123 }), // invalid: flagName should be string, missing userId
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeDefined();
  });

  it("returns 400 for unknown flag", async () => {
    const app = createApi(validConfig);

    const res = await app.request("/flags/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flagName: "unknown-flag", userId: "user" }),
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("unknown-flag");
  });
});
