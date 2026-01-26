import { describe, it, expect } from "vitest";
import { zodUserSchema, valibotUserSchema, arktypeUserSchema } from "./libraries";
import * as v from "valibot";
import { type } from "arktype";

const validUser = {
  name: "Alice",
  email: "alice@example.com",
  age: 30,
};

const invalidUser = {
  name: "Bob",
  email: "not-an-email",
  age: 200,
};

describe("Zod", () => {
  it("validates a correct user", () => {
    const result = zodUserSchema.safeParse(validUser);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Alice");
      expect(result.data.email).toBe("alice@example.com");
      expect(result.data.age).toBe(30);
    }
  });

  it("rejects invalid email and age", () => {
    const result = zodUserSchema.safeParse(invalidUser);
    expect(result.success).toBe(false);
  });

  it("rejects non-object input", () => {
    const result = zodUserSchema.safeParse("not an object");
    expect(result.success).toBe(false);
  });
});

describe("Valibot", () => {
  it("validates a correct user", () => {
    const result = v.safeParse(valibotUserSchema, validUser);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.output.name).toBe("Alice");
      expect(result.output.email).toBe("alice@example.com");
      expect(result.output.age).toBe(30);
    }
  });

  it("rejects invalid email and age", () => {
    const result = v.safeParse(valibotUserSchema, invalidUser);
    expect(result.success).toBe(false);
  });

  it("rejects non-object input", () => {
    const result = v.safeParse(valibotUserSchema, "not an object");
    expect(result.success).toBe(false);
  });
});

describe("ArkType", () => {
  it("validates a correct user", () => {
    const result = arktypeUserSchema(validUser);
    const isError = result instanceof type.errors;
    expect(isError).toBe(false);
    if (!isError) {
      expect(result.name).toBe("Alice");
      expect(result.email).toBe("alice@example.com");
      expect(result.age).toBe(30);
    }
  });

  it("rejects invalid age", () => {
    const result = arktypeUserSchema(invalidUser);
    expect(result instanceof type.errors).toBe(true);
  });

  it("rejects non-object input", () => {
    const result = arktypeUserSchema("not an object" as any);
    expect(result instanceof type.errors).toBe(true);
  });
});
