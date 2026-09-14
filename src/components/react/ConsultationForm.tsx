import { zodResolver } from "@hookform/resolvers/zod";
import { track } from "@vercel/analytics";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { budgetRangeLabels, projectTypeLabels, timelineLabels } from "../../lib/form-options";
import {
  budgetRangeOptions,
  consultationSchema,
  projectTypeOptions,
  timelineOptions,
  type ConsultationInput,
} from "../../lib/schemas";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

type SubmitState = "idle" | "submitting" | "success" | "error";

export default function ConsultationForm() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ConsultationInput>({
    resolver: zodResolver(consultationSchema),
    defaultValues: { company: "" },
  });

  async function onSubmit(data: ConsultationInput) {
    setSubmitState("submitting");
    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("request failed");
      track("consultation_submitted");
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  }

  if (submitState === "success") {
    return (
      <div role="status" className="rounded-sm border border-border bg-surface p-8">
        <h3 className="font-display text-2xl text-ink">Thank you — your enquiry is in.</h3>
        <p className="mt-3 text-sm text-muted">
          We read every enquiry personally and reply within two working days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {/* Honeypot: hidden from sighted and keyboard users, left for bots to fill in. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <Label htmlFor="company">Company</Label>
        <input id="company" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" autoComplete="name" {...register("name")} />
          {errors.name && <p className="text-xs text-clay">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
          {errors.email && <p className="text-xs text-clay">{errors.email.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" autoComplete="tel" {...register("phone")} />
        {errors.phone && <p className="text-xs text-clay">{errors.phone.message}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="projectType">Project type</Label>
          <Select
            onValueChange={(v) =>
              setValue("projectType", v as ConsultationInput["projectType"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="projectType" aria-label="Project type">
              <SelectValue placeholder="Select one" />
            </SelectTrigger>
            <SelectContent>
              {projectTypeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {projectTypeLabels[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.projectType && <p className="text-xs text-clay">{errors.projectType.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="budgetRange">Budget range</Label>
          <Select
            onValueChange={(v) =>
              setValue("budgetRange", v as ConsultationInput["budgetRange"], {
                shouldValidate: true,
              })
            }
          >
            <SelectTrigger id="budgetRange" aria-label="Budget range">
              <SelectValue placeholder="Select one" />
            </SelectTrigger>
            <SelectContent>
              {budgetRangeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {budgetRangeLabels[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.budgetRange && <p className="text-xs text-clay">{errors.budgetRange.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="timeline">Timeline</Label>
          <Select
            onValueChange={(v) =>
              setValue("timeline", v as ConsultationInput["timeline"], { shouldValidate: true })
            }
          >
            <SelectTrigger id="timeline" aria-label="Timeline">
              <SelectValue placeholder="Select one" />
            </SelectTrigger>
            <SelectContent>
              {timelineOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {timelineLabels[option]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.timeline && <p className="text-xs text-clay">{errors.timeline.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="message">Tell us about your project</Label>
        <Textarea id="message" rows={5} {...register("message")} />
        {errors.message && <p className="text-xs text-clay">{errors.message.message}</p>}
      </div>

      {submitState === "error" && (
        <p role="alert" className="text-sm text-clay">
          Something went wrong sending your enquiry. Please try again, or email us directly.
        </p>
      )}

      <Button type="submit" disabled={submitState === "submitting"}>
        {submitState === "submitting" ? "Sending…" : "Request a consultation"}
      </Button>
    </form>
  );
}
