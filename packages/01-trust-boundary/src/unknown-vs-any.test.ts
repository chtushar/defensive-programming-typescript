import { describe, it, expect } from "vitest";

describe("any = 'Disable type checking'", () => {
  // Simulates data coming from an external source (API, user input, etc.)
  function getExternalData(): any {
    return { name: "Alice", age: 30 };
  }

  function getMalformedData(): any {
    return null; // API returned null instead of an object
  }

  it.todo("works when you're lucky");

  it.todo("crashes when you're wrong - runtime error");

  it.todo("causes silent bugs - NaN, undefined propagation");
});

describe("unknown - Need to Verify the Types", () => {
  function getExternalData(): unknown {
    return { name: "Alice", age: 30 };
  }

  it.todo("blocks unsafe access at compile time");

  it.todo("allows access after typeof narrowing");

  it.todo("allows access after instanceof narrowing");

  it.todo("allows access after custom type guard");
});

describe("real world: parsing JSON from API", () => {
  // Simulates JSON.parse which returns `any` by default
  const apiResponse = '{"userId": 123, "email": "alice@example.com"}';
  function parseUserUnsafe(json: string): any {
    return JSON.parse(json);
  }
  const user = parseUserUnsafe(apiResponse);

  it.todo("unsafe: any allows accessing non-existent nested properties");

  function parseUserSafe(json: string): unknown {
    return JSON.parse(json);
  }

  it.todo("safe: unknown + type guard validates before access");
});

describe("narrowing unknown safely", () => {
  function process(value: unknown): string | number | null {
    return false as any;
  }

  it.todo("narrows string and calls string methods", () => {
    expect(process("hello")).toBe("HELLO");
  });

  it.todo("narrows number and calls number methods", () => {
    expect(process(3.14159)).toBe("3.14");
  });

  it.todo("narrows Error and accesses properties", () => {
    expect(process(new Error("oops"))).toBe("oops");
  });

  it.todo("returns null for unhandled types", () => {
    expect(process({ foo: "bar" })).toBeNull();
    expect(process(null)).toBeNull();
    expect(process(undefined)).toBeNull();
    expect(process([1, 2, 3])).toBeNull();
  });
});
