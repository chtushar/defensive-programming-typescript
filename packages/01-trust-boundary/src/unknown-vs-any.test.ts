import { describe, it, expect } from "vitest";
import { getNameUnsafe, getNameSafe, processValue } from "./unknown-vs-any";

describe("unknown vs any", () => {
  /**
   * Exercise 1: See how `any` causes runtime crashes
   *
   * The function compiles fine but crashes when data is null.
   * This is why `any` is dangerous - TypeScript can't help you.
   */
  it("any: compiles but crashes at runtime", () => {
    // Works when data has the expected shape
    expect(getNameUnsafe({ name: "alice" })).toBe("ALICE");

    // Crashes when data is null - TypeScript didn't warn us!
    expect(() => getNameUnsafe(null)).toThrow();
  });

  /**
   * Exercise 2: Implement getNameSafe() to pass this test
   *
   * With `unknown`, TypeScript forces you to verify the type
   * before accessing properties. This prevents runtime crashes.
   */
  it("unknown: forces type checking, returns null for invalid data", () => {
    // Works with valid data
    expect(getNameSafe({ name: "alice" })).toBe("ALICE");

    // Returns null instead of crashing
    expect(getNameSafe(null)).toBeNull();
    expect(getNameSafe(undefined)).toBeNull();
    expect(getNameSafe({ name: 123 })).toBeNull(); // name is not a string
    expect(getNameSafe("not an object")).toBeNull();
  });

  /**
   * Exercise 3: Implement processValue() to pass this test
   *
   * Practice narrowing `unknown` to different types using:
   * - typeof for primitives (string, number)
   * - instanceof for class instances (Error)
   */
  it("narrowing unknown: handle multiple types safely", () => {
    expect(processValue("hello")).toBe("HELLO");
    expect(processValue(3.14159)).toBe("3.14");
    expect(processValue(new Error("oops"))).toBe("oops");

    // Unhandled types return null
    expect(processValue({ foo: "bar" })).toBeNull();
    expect(processValue([1, 2, 3])).toBeNull();
    expect(processValue(null)).toBeNull();
  });
});
