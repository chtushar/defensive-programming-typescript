import { describe, it, expect } from "vitest";
import { z } from "zod";
import * as v from "valibot";
import { type } from "arktype";

const validUser = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  email: "alice@example.com",
  role: "admin" as const,
};

const invalidUser = {
  id: "not-a-uuid",
  email: "not-an-email",
  role: "superadmin",
};

describe("Zod - Largest ecosystem, chainable API", () => {
  it.todo("parses valid data with safeParse()");

  it.todo("returns errors for invalid data");

  it.todo("throws on parse() with invalid data");
});

describe("Valibot - Tiny bundle, tree-shakeable", () => {
  it.todo("parses valid data with v.safeParse()");

  it.todo("returns errors for invalid data");

  it.todo("throws on v.parse() with invalid data");
});

describe("Arktype - TypeScript-like syntax, fastest", () => {
  it.todo("parses valid data by calling schema directly");

  it.todo("returns type.errors for invalid data");
});
