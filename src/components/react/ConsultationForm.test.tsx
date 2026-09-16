import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import ConsultationForm from "./ConsultationForm";

vi.mock("@vercel/analytics", () => ({ track: vi.fn() }));

afterEach(() => {
  vi.restoreAllMocks();
});

async function fillValidForm() {
  await userEvent.type(screen.getByLabelText(/full name/i), "Hui Min Tan");
  await userEvent.type(screen.getByLabelText(/^email$/i), "hui.min@example.com");
  await userEvent.type(screen.getByLabelText(/^phone$/i), "+65 9123 4567");
  await userEvent.click(screen.getByRole("combobox", { name: /project type/i }));
  await userEvent.click(await screen.findByRole("option", { name: "Residential" }));
  await userEvent.click(screen.getByRole("combobox", { name: /budget/i }));
  await userEvent.click(await screen.findByRole("option", { name: "S$250,000 – S$500,000" }));
  await userEvent.click(screen.getByRole("combobox", { name: /timeline/i }));
  await userEvent.click(await screen.findByRole("option", { name: "6–12 months" }));
  await userEvent.type(
    screen.getByLabelText(/tell us about your project/i),
    "We are renovating a 4-room flat in Bukit Timah and would like a full consultation."
  );
}

describe("ConsultationForm", () => {
  it("shows inline errors when submitted empty", async () => {
    render(<ConsultationForm />);
    await userEvent.click(screen.getByRole("button", { name: /request a consultation/i }));
    expect(await screen.findByText(/enter your full name/i)).toBeInTheDocument();
    expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it("has a visually hidden honeypot field that real users never see", () => {
    render(<ConsultationForm />);
    const honeypot = screen.getByLabelText(/leave blank/i, { selector: "input" });
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot.closest("[aria-hidden]")).toBeTruthy();
  });

  it("submits, shows a success state on 200, and fires the analytics event", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal("fetch", fetchMock);
    const { track } = await import("@vercel/analytics");

    render(<ConsultationForm />);
    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: /request a consultation/i }));

    expect(await screen.findByText(/thank you/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/consultation",
      expect.objectContaining({ method: "POST" })
    );
    expect(track).toHaveBeenCalledWith("consultation_submitted");
  });

  it("shows a friendly error state when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, json: async () => ({ ok: false, error: "nope" }) })
    );

    render(<ConsultationForm />);
    await fillValidForm();
    await userEvent.click(screen.getByRole("button", { name: /request a consultation/i }));

    expect(await screen.findByText(/something went wrong|try again/i)).toBeInTheDocument();
  });
});
