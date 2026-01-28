import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn utility function", () => {
  it("merges class names correctly", () => {
    const result = cn("foo", "bar");
    expect(result).toBe("foo bar");
  });

  it("handles undefined values", () => {
    const result = cn("foo", undefined, "bar");
    expect(result).toBe("foo bar");
  });

  it("handles null values", () => {
    const result = cn("foo", null, "bar");
    expect(result).toBe("foo bar");
  });

  it("handles boolean conditions", () => {
    const isActive = true;
    const result = cn("base", isActive && "active");
    expect(result).toBe("base active");
  });

  it("handles false conditions", () => {
    const isActive = false;
    const result = cn("base", isActive && "active");
    expect(result).toBe("base");
  });

  it("merges tailwind classes correctly", () => {
    const result = cn("px-2 py-1", "px-4");
    expect(result).toBe("py-1 px-4");
  });

  it("handles object syntax", () => {
    const result = cn({ foo: true, bar: false, baz: true });
    expect(result).toBe("foo baz");
  });

  it("handles array syntax", () => {
    const result = cn(["foo", "bar"]);
    expect(result).toBe("foo bar");
  });

  it("handles empty inputs", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("handles complex tailwind merging", () => {
    const result = cn(
      "bg-red-500 text-white",
      "bg-blue-500",
      "hover:bg-green-500"
    );
    expect(result).toBe("text-white bg-blue-500 hover:bg-green-500");
  });

  it("handles responsive classes", () => {
    const result = cn("w-full", "md:w-1/2", "lg:w-1/3");
    expect(result).toBe("w-full md:w-1/2 lg:w-1/3");
  });

  it("handles conflicting responsive classes", () => {
    const result = cn("md:w-full", "md:w-1/2");
    expect(result).toBe("md:w-1/2");
  });
});
