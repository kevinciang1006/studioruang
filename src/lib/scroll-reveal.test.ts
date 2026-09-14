import { describe, expect, it } from "vitest";
import { revealClassNameFor } from "./scroll-reveal";

describe("revealClassNameFor", () => {
  it("shows content immediately when reduced motion is preferred", () => {
    expect(revealClassNameFor(false, true)).toBe("reveal-visible");
  });

  it("hides content that has not intersected yet", () => {
    expect(revealClassNameFor(false, false)).toBe("reveal-hidden");
  });

  it("reveals content once it intersects", () => {
    expect(revealClassNameFor(true, false)).toBe("reveal-visible");
  });
});
