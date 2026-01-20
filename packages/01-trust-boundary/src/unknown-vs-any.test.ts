import { describe, it, expect } from "vitest";

describe("any = 'Disable type checking'", () => {
  function getExternalData(): any {
    return { name: "Alice", age: 30 };
  }

  function getMalformedData(): any {
    return null; // API returned null instead of an object
  }

  it("works when you're lucky", () => {
    const data = getExternalData();
    expect(data.name).toBe("Alice");
    expect(data.age).toBe(30);
  });

  it("crashes when you're wrong - runtime error", () => {
    const data = getMalformedData();
    expect(() => data.name).toThrow(); // Runtime crash!
  });

  it("causes silent bugs - NaN, undefined propagation", () => {
    const data: any = { name: "Alice" }; // age is missing
    const ageNextYear = data.age + 1; // undefined + 1 = NaN
    expect(ageNextYear).toBeNaN(); // Silent bug!
  });
});

describe("unknown - Need to Verify the Types", () => {
  function getExternalData(): unknown {
    return { name: "Alice", age: 30 };
  }

  it("blocks unsafe access at compile time", () => {
    const data = getExternalData();
    // data.name  // ✗ Error: 'data' is of type 'unknown'
    expect(typeof data).toBe("object");
  });

  it("allows access after typeof narrowing", () => {
    const value: unknown = "hello";
    if (typeof value === "string") {
      expect(value.toUpperCase()).toBe("HELLO");
    }
  });

  it("allows access after instanceof narrowing", () => {
    const value: unknown = new Date("2024-01-01");
    if (value instanceof Date) {
      expect(value.getFullYear()).toBe(2024);
    }
  });

  it("allows access after custom type guard", () => {
    function isUser(val: unknown): val is { name: string; age: number } {
      return (
        typeof val === "object" && val !== null && "name" in val && "age" in val
      );
    }
    const data = getExternalData();
    if (isUser(data)) {
      expect(data.name).toBe("Alice");
      expect(data.age).toBe(30);
    }
  });
});

describe("real world: parsing JSON from API", () => {
  const apiResponse = '{"userId": 123, "email": "alice@example.com"}';

  function parseUserUnsafe(json: string): any {
    return JSON.parse(json);
  }

  it("unsafe: any allows accessing non-existent nested properties", () => {
    const user = parseUserUnsafe(apiResponse);
    expect(user.userId).toBe(123);
    expect(user.email).toBe("alice@example.com");
    // This will CRASH at runtime - accessing nested property on undefined
    expect(() => user.doesNotExist.nested).toThrow();
  });

  function parseUserSafe(json: string): unknown {
    return JSON.parse(json);
  }

  // Use Record<string, unknown> instead of `any` - it still requires type checks
  function isValidUser(
    data: unknown,
  ): data is { userId: number; email: string } {
    if (typeof data !== "object" || data === null) {
      return false;
    }

    const obj = data as Record<string, unknown>;
    return (
      typeof obj["userId"] === "number" && typeof obj["email"] === "string"
    );
  }

  it("safe: unknown + type guard validates before access", () => {
    const parsed = parseUserSafe(apiResponse);
    if (isValidUser(parsed)) {
      expect(parsed.userId).toBe(123);
      expect(parsed.email).toBe("alice@example.com");
    }
  });
});

describe("narrowing unknown safely", () => {
  function process(value: unknown): string | number | null {
    if (typeof value === "string") {
      return value.toUpperCase();
    }

    if (typeof value === "number") {
      return value.toFixed(2);
    }

    if (value instanceof Error) {
      return value.message;
    }

    return null;
  }

  it("narrows string and calls string methods", () => {
    expect(process("hello")).toBe("HELLO");
  });

  it("narrows number and calls number methods", () => {
    expect(process(3.14159)).toBe("3.14");
  });

  it("narrows Error and accesses properties", () => {
    expect(process(new Error("oops"))).toBe("oops");
  });

  it("returns null for unhandled types", () => {
    expect(process({ foo: "bar" })).toBeNull();
    expect(process(null)).toBeNull();
    expect(process(undefined)).toBeNull();
    expect(process([1, 2, 3])).toBeNull();
  });
});
