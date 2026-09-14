import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import ProjectFilter from "./ProjectFilter";
import type { Project } from "../../data/projects";

function baseProject(slug: string, category: Project["category"]): Project {
  return {
    slug,
    name: `Project ${slug}`,
    category,
    year: 2024,
    location: "Singapore",
    scope: "Full residential design",
    narrative: ["a", "b"],
    coverImage: `/images/${slug}.jpg`,
    coverImageAlt: `Cover photo for project ${slug}`,
    gallery: [{ src: `/images/${slug}-1.jpg`, alt: "gallery image" }],
  };
}

const sample: Project[] = [
  baseProject("r1", "Residential"),
  baseProject("c1", "Commercial"),
  baseProject("n1", "Renovation"),
];

beforeEach(() => {
  window.history.pushState({}, "", "/projects");
});

describe("ProjectFilter", () => {
  it("shows all projects by default", () => {
    render(<ProjectFilter projects={sample} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("filters to a single category on click and updates the URL", async () => {
    render(<ProjectFilter projects={sample} />);
    await userEvent.click(screen.getByRole("button", { name: "Residential" }));

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(1);
    expect(within(items[0]!).getByText("Project r1")).toBeInTheDocument();
    expect(window.location.search).toBe("?category=residential");
  });

  it("is keyboard operable", async () => {
    render(<ProjectFilter projects={sample} />);
    const button = screen.getByRole("button", { name: "Commercial" });
    button.focus();
    await userEvent.keyboard("{Enter}");
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("reads the initial category back out of the URL on mount", () => {
    window.history.pushState({}, "", "/projects?category=renovation");
    render(<ProjectFilter projects={sample} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(screen.getByText("Project n1")).toBeInTheDocument();
  });
});
