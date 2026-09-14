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
  // Honeypot: must stay empty. Bots that autofill every field will trip this.
  company: z.string().max(0, "Leave this field empty.").optional().default(""),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;
