import { describe, expect, it } from "vitest";
import { projects } from "../data/projects";
import { getAdjacentProject } from "./projects-nav";

describe("getAdjacentProject", () => {
  it("returns the next project in sequence", () => {
    expect(getAdjacentProject(projects[0]!.slug).slug).toBe(projects[1]!.slug);
  });

  it("wraps from the last project back to the first", () => {
    const last = projects[projects.length - 1]!;
    expect(getAdjacentProject(last.slug).slug).toBe(projects[0]!.slug);
  });

  it("throws for an unknown slug", () => {
    expect(() => getAdjacentProject("does-not-exist")).toThrow();
  });
});
