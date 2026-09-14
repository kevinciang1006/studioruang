import { projects, type Project } from "../data/projects";

export function getAdjacentProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) {
    throw new Error(`Unknown project slug: ${slug}`);
  }
  const nextIndex = (index + 1) % projects.length;
  const next = projects[nextIndex];
  if (!next) {
    throw new Error("Project list is empty.");
  }
  return next;
}
