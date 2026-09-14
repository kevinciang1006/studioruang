import { describe, expect, it } from "vitest";
import { projects } from "./projects";

describe("projects data", () => {
  it("has exactly 6 projects", () => {
    expect(projects).toHaveLength(6);
  });

  it("has unique slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every project has 2-3 narrative paragraphs and 4-6 gallery images", () => {
    for (const project of projects) {
      expect(project.narrative.length).toBeGreaterThanOrEqual(2);
      expect(project.narrative.length).toBeLessThanOrEqual(3);
      expect(project.gallery.length).toBeGreaterThanOrEqual(4);
      expect(project.gallery.length).toBeLessThanOrEqual(6);
      expect(project.coverImageAlt.length).toBeGreaterThan(10);
      for (const image of project.gallery) {
        expect(image.alt.length).toBeGreaterThan(10);
      }
    }
  });

  it("includes the six canonical PRD projects", () => {
    const slugs = projects.map((p) => p.slug).sort();
    expect(slugs).toEqual(
      [
        "amoy-street-cafe",
        "bukit-timah-house",
        "emerald-hill-terrace",
        "keppel-bay-duplex",
        "sentosa-cove-villa",
        "tanjong-pagar-loft",
      ].sort()
    );
  });
});
