import { describe, it, expect } from "vitest";
import { v, type Infer } from "./mini-validator";

/**
 * Mini Validator Workshop
 *
 * We'll build a tiny validation library to understand how Zod/Valibot/ArkType work.
 * Key concepts:
 * 1. Schemas are objects with a `parse` method
 * 2. `parse` returns { success, data } or { success, errors }
 * 3. TypeScript infers types from schemas (the magic!)
 */

describe("primitive validators", () => {
  it("v.string() validates strings", () => {
    const schema = v.string();

    expect(schema.parse("hello")).toEqual({ success: true, data: "hello" });
    expect(schema.parse(123)).toEqual({
      success: false,
      errors: ["Expected string, got number"],
    });
    expect(schema.parse(null)).toEqual({
      success: false,
      errors: ["Expected string, got null"],
    });
  });

  it("v.number() validates numbers", () => {
    const schema = v.number();

    expect(schema.parse(42)).toEqual({ success: true, data: 42 });
    expect(schema.parse(3.14)).toEqual({ success: true, data: 3.14 });
    expect(schema.parse("42")).toEqual({
      success: false,
      errors: ["Expected number, got string"],
    });
  });

  it("v.boolean() validates booleans", () => {
    const schema = v.boolean();

    expect(schema.parse(true)).toEqual({ success: true, data: true });
    expect(schema.parse(false)).toEqual({ success: true, data: false });
    expect(schema.parse("true")).toEqual({
      success: false,
      errors: ["Expected boolean, got string"],
    });
  });
});

describe("object validator", () => {
  it("v.object() validates object shape", () => {
    const schema = v.object({
      name: v.string(),
      age: v.number(),
    });

    expect(schema.parse({ name: "Alice", age: 30 })).toEqual({
      success: true,
      data: { name: "Alice", age: 30 },
    });
  });

  it("v.object() returns errors for invalid fields", () => {
    const schema = v.object({
      name: v.string(),
      age: v.number(),
    });

    const result = schema.parse({ name: 123, age: "thirty" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toContain("name: Expected string, got number");
      expect(result.errors).toContain("age: Expected number, got string");
    }
  });

  it("v.object() returns error for non-objects", () => {
    const schema = v.object({ name: v.string() });

    expect(schema.parse(null)).toEqual({
      success: false,
      errors: ["Expected object, got null"],
    });
    expect(schema.parse("not an object")).toEqual({
      success: false,
      errors: ["Expected object, got string"],
    });
  });
});

describe("type inference (the magic!)", () => {
  it("infers primitive types", () => {
    const stringSchema = v.string();
    const numberSchema = v.number();

    // TypeScript infers these types from the schema!
    type StringType = Infer<typeof stringSchema>;
    type NumberType = Infer<typeof numberSchema>;

    // These are compile-time checks - if they compile, inference works
    const str: StringType = "hello";
    const num: NumberType = 42;

    expect(str).toBe("hello");
    expect(num).toBe(42);
  });

  it("infers object types", () => {
    const userSchema = v.object({
      name: v.string(),
      age: v.number(),
      active: v.boolean(),
    });

    // TypeScript infers: { name: string; age: number; active: boolean }
    type User = Infer<typeof userSchema>;

    const user: User = { name: "Alice", age: 30, active: true };
    expect(user.name).toBe("Alice");
  });
});
