import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button", () => {
  it("renders its children and responds to click", async () => {
    const onClick = vi.fn();
    render(
      <Button variant="primary" onClick={onClick}>
        Book a consultation
      </Button>
    );
    const button = screen.getByRole("button", { name: "Book a consultation" });
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("disables interaction when disabled", () => {
    render(<Button disabled>Submit</Button>);
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });
});
