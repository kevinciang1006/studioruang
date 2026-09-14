import { z } from "zod";

export const projectTypeOptions = ["residential", "renovation", "commercial"] as const;
export const budgetRangeOptions = ["under-100k", "100k-250k", "250k-500k", "500k-plus"] as const;
export const timelineOptions = [
  "within-3-months",
  "3-6-months",
  "6-12-months",
  "flexible",
] as const;

export const consultationSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z
    .string()
    .trim()
    .min(8, "Enter a valid phone number.")
    .max(20)
    .regex(/^[0-9+()\-\s]+$/, "Use digits, spaces, + and - only."),
  projectType: z.enum(projectTypeOptions, {
    errorMap: () => ({ message: "Select a project type." }),
  }),
  budgetRange: z.enum(budgetRangeOptions, {
    errorMap: () => ({ message: "Select a budget range." }),
  }),
  timeline: z.enum(timelineOptions, {
    errorMap: () => ({ message: "Select a timeline." }),
  }),
  message: z.string().trim().min(20, "Tell us a little more (20 characters minimum).").max(2000),
  // Honeypot: humans never see or fill this field (see ConsultationForm.tsx). It stays
  // permissive here — a filled value is still a *valid* submission as far as the schema
  // is concerned — because the honeypot check happens after parsing, in the API route
  // (src/pages/api/consultation.ts), which needs `parsed.data.company` to inspect it
  // rather than have zod reject the request before that check ever runs.
  company: z.string().max(200).optional().default(""),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;
