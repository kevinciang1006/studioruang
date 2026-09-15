export const prerender = false;

import type { APIContext } from "astro";
import { consultationSchema } from "../../lib/schemas";
import { getSupabaseServerClient } from "../../lib/supabase";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  const limited = recent.length >= RATE_LIMIT_MAX_REQUESTS;
  recent.push(now);
  requestLog.set(ip, recent);
  return limited;
}

function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request, clientAddress }: APIContext): Promise<Response> {
  const ip = clientAddress || "unknown";

  if (isRateLimited(ip)) {
    return jsonResponse(429, { ok: false, error: "Too many requests. Please try again shortly." });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { ok: false, error: "Invalid request body." });
  }

  const parsed = consultationSchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse(400, { ok: false, error: "Please check the form and try again." });
  }

  if (parsed.data.company) {
    // Honeypot tripped: pretend success so automated fillers don't learn to adapt. Logged
    // (not surfaced to the client) so a real incident isn't confused with a bot bounce.
    console.info("[api/consultation] Honeypot tripped, no row inserted.");
    return jsonResponse(200, { ok: true });
  }

  const { name, email, phone, projectType, budgetRange, timeline, message } = parsed.data;

  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("studioruang_consultations").insert({
      name,
      email,
      phone,
      project_type: projectType,
      budget_range: budgetRange,
      timeline,
      message,
      source: "studio-ruang",
    });

    if (error) {
      console.error("[api/consultation] Supabase insert error:", error);
      return jsonResponse(502, {
        ok: false,
        error: "We could not save your enquiry. Please try again.",
      });
    }

    return jsonResponse(200, { ok: true });
  } catch (err) {
    console.error("[api/consultation] Unexpected error:", err);
    return jsonResponse(500, { ok: false, error: "Something went wrong. Please try again." });
  }
}
