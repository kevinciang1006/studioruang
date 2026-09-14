import { budgetRangeOptions, projectTypeOptions, timelineOptions } from "./schemas";

export const projectTypeLabels: Record<(typeof projectTypeOptions)[number], string> = {
  residential: "Residential",
  renovation: "Renovation",
  commercial: "Commercial",
};

export const budgetRangeLabels: Record<(typeof budgetRangeOptions)[number], string> = {
  "under-100k": "Under S$100,000",
  "100k-250k": "S$100,000 – S$250,000",
  "250k-500k": "S$250,000 – S$500,000",
  "500k-plus": "S$500,000+",
};

export const timelineLabels: Record<(typeof timelineOptions)[number], string> = {
  "within-3-months": "Within 3 months",
  "3-6-months": "3–6 months",
  "6-12-months": "6–12 months",
  flexible: "Flexible / not yet decided",
};
