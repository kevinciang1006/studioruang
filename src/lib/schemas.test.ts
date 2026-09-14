import { describe, expect, it } from "vitest";
import { consultationSchema } from "./schemas";

const validPayload = {
  name: "Hui Min Tan",
  email: "hui.min@example.com",
  phone: "+65 9123 4567",
  projectType: "residential",
  budgetRange: "250k-500k",
  timeline: "6-12-months",
  message: "We're renovating a 4-room flat in Bukit Timah and would like a full consultation.",
  company: "",
};

describe("consultationSchema", () => {
  it("accepts a fully valid payload", () => {
    const result = consultationSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("rejects a missing name", () => {
    const result = consultationSchema.safeParse({ ...validPayload, name: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = consultationSchema.safeParse({ ...validPayload, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid project type", () => {
    const result = consultationSchema.safeParse({ ...validPayload, projectType: "spaceship" });
    expect(result.success).toBe(false);
  });

  it("rejects a message under 20 characters", () => {
    const result = consultationSchema.safeParse({ ...validPayload, message: "Too short" });
    expect(result.success).toBe(false);
  });

  it("rejects a non-empty honeypot field", () => {
    const result = consultationSchema.safeParse({ ...validPayload, company: "Acme Bots" });
    expect(result.success).toBe(false);
  });
});
