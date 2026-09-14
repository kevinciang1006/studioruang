import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Lightbox from "./Lightbox";

const images = [
  { src: "/a.jpg", alt: "Photo A" },
  { src: "/b.jpg", alt: "Photo B" },
  { src: "/c.jpg", alt: "Photo C" },
];

describe("Lightbox", () => {
  it("opens the dialog with the clicked image when a thumbnail is activated", async () => {
    render(<Lightbox images={images} />);
    await userEvent.click(screen.getAllByRole("button")[1]!);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByAltText("Photo B")).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    render(<Lightbox images={images} />);
    const trigger = screen.getAllByRole("button")[0]!;
    await userEvent.click(trigger);
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("navigates forward and backward with the arrow keys", async () => {
    render(<Lightbox images={images} />);
    await userEvent.click(screen.getAllByRole("button")[0]!);
    await userEvent.keyboard("{ArrowRight}");
    expect(within(screen.getByRole("dialog")).getByAltText("Photo B")).toBeInTheDocument();
    await userEvent.keyboard("{ArrowLeft}");
    expect(within(screen.getByRole("dialog")).getByAltText("Photo A")).toBeInTheDocument();
  });

  it("closes when the backdrop is clicked but not when the image is clicked", async () => {
    render(<Lightbox images={images} />);
    await userEvent.click(screen.getAllByRole("button")[0]!);
    const dialog = screen.getByRole("dialog");
    await userEvent.click(within(dialog).getByAltText("Photo A"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("dialog"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
