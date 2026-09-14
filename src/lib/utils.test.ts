import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("merges class names and drops falsy values", () => {
    const shouldIncludeB = false;
    expect(cn("a", shouldIncludeB && "b", "c")).toBe("a c");
  });

  it("resolves conflicting tailwind classes to the last one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
