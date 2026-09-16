// This test lives outside src/pages/ deliberately: Astro's file-based router treats
// every .ts file under src/pages/ as a route/endpoint, so a colocated *.test.ts there
// gets swept into the production build (and fails it, since it imports vitest). See
// vitest.config.ts's `exclude` for the corresponding build-side guard.
import { beforeEach, describe, expect, it, vi } from "vitest";

const insertMock = vi.fn().mockResolvedValue({ error: null });
vi.mock("../../../src/lib/supabase", () => ({
  getSupabaseServerClient: () => ({
    from: () => ({ insert: insertMock }),
  }),
}));

function makeRequest(body: unknown) {
  return new Request("https://studioruang.kevinciang.com/api/consultation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validPayload = {
  name: "Hui Min Tan",
  email: "hui.min@example.com",
  phone: "+65 9123 4567",
  projectType: "residential",
  budgetRange: "250k-500k",
  timeline: "6-12-months",
  message: "We are renovating a 4-room flat in Bukit Timah and would like a full consultation.",
  website_url: "",
};

describe("POST /api/consultation", () => {
  beforeEach(() => {
    insertMock.mockClear();
    vi.resetModules();
  });

  it("inserts a valid submission and returns 200", async () => {
    const { POST } = await import("../../../src/pages/api/consultation");
    const response = await POST({
      request: makeRequest(validPayload),
      clientAddress: "203.0.113.10",
    } as never);

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ ok: true });
    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Hui Min Tan", project_type: "residential" })
    );
  });

  it("rejects an invalid payload with 400 and does not insert", async () => {
    const { POST } = await import("../../../src/pages/api/consultation");
    const response = await POST({
      request: makeRequest({ ...validPayload, email: "not-an-email" }),
      clientAddress: "203.0.113.11",
    } as never);

    expect(response.status).toBe(400);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("silently accepts (200) but never inserts when the honeypot is filled", async () => {
    const { POST } = await import("../../../src/pages/api/consultation");
    const response = await POST({
      request: makeRequest({ ...validPayload, website_url: "Bot Co" }),
      clientAddress: "203.0.113.12",
    } as never);

    expect(response.status).toBe(200);
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("rate-limits after 5 requests from the same IP within the window", async () => {
    const { POST } = await import("../../../src/pages/api/consultation");
    const ip = "203.0.113.13";
    for (let i = 0; i < 5; i += 1) {
      const ok = await POST({ request: makeRequest(validPayload), clientAddress: ip } as never);
      expect(ok.status).toBe(200);
    }
    const limited = await POST({
      request: makeRequest(validPayload),
      clientAddress: ip,
    } as never);
    expect(limited.status).toBe(429);
  });
});
