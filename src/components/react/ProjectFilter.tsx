import { useEffect, useMemo, useState } from "react";
import type { Project } from "../../data/projects";

type CategoryFilter = "all" | "residential" | "commercial" | "renovation";

const CATEGORIES: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "renovation", label: "Renovation" },
];

function readCategoryFromUrl(): CategoryFilter {
  if (typeof window === "undefined") return "all";
  const value = new URLSearchParams(window.location.search).get("category");
  return CATEGORIES.some((c) => c.value === value) ? (value as CategoryFilter) : "all";
}

interface ProjectFilterProps {
  projects: Project[];
}

export default function ProjectFilter({ projects }: ProjectFilterProps) {
  const [category, setCategory] = useState<CategoryFilter>(() => readCategoryFromUrl());

  useEffect(() => {
    const onPopState = () => setCategory(readCategoryFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function selectCategory(next: CategoryFilter) {
    setCategory(next);
    const url = new URL(window.location.href);
    if (next === "all") {
      url.searchParams.delete("category");
    } else {
      url.searchParams.set("category", next);
    }
    window.history.pushState({}, "", url);
  }

  const visibleProjects = useMemo(() => {
    if (category === "all") return projects;
    return projects.filter((project) => project.category.toLowerCase() === category);
  }, [category, projects]);

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-3">
        {CATEGORIES.map((c) => {
          const isActive = category === c.value;
          return (
            <button
              key={c.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => selectCategory(c.value)}
              className={
                isActive
                  ? "rounded-sm border border-ink bg-ink px-4 py-2 text-xs uppercase tracking-widest text-bone"
                  : "rounded-sm border border-border px-4 py-2 text-xs uppercase tracking-widest text-ink hover:border-ink"
              }
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.map((project) => (
          <li key={project.slug}>
            <a href={`/projects/${project.slug}`} className="group block">
              <img
                src={project.coverImage}
                alt={project.coverImageAlt}
                width={800}
                height={600}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-sm object-cover"
              />
              <h3 className="mt-4 font-display text-xl text-ink">{project.name}</h3>
              <p className="mt-1 text-xs uppercase tracking-widest text-muted">
                {project.category} · {project.year}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
