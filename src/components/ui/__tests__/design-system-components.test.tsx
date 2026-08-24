import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ToggleChip } from "@/components/ui/toggle-chip";

describe("design-system UI components", () => {
  it("Button preserves native button behavior and disabled state", async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Button onClick={onClick}>Save</Button>);

    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledOnce();

    rerender(
      <Button onClick={onClick} disabled>
        Save
      </Button>
    );
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("buttonVariants can style links without nesting a button", () => {
    render(
      <Link href="/work" className={buttonVariants({ variant: "outline", size: "sm" })}>
        Work
      </Link>
    );

    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute("href", "/work");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("Button can render an anchor without invalid interactive nesting", () => {
    render(<Button render={<a href="https://example.com/work" aria-label="Work" />}>Work</Button>);

    const link = screen.getByRole("link", { name: "Work" });
    expect(link).toHaveAttribute("href", "https://example.com/work");
    expect(link).toHaveAttribute("data-slot", "button");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("uses contextual focus and interactive border tokens", () => {
    const secondary = buttonVariants({ variant: "secondary" });
    expect(secondary).toContain("outline-[color:var(--section-focus-ring)]");
    expect(secondary).toContain("border-[color:var(--section-border-interactive)]");
  });

  it("ToggleChip exposes its pressed state through the native button", async () => {
    const onClick = vi.fn();
    render(
      <ToggleChip pressed onClick={onClick}>
        TypeScript
      </ToggleChip>
    );

    const chip = screen.getByRole("button", { name: "TypeScript", pressed: true });
    expect(chip).toHaveAttribute("aria-pressed", "true");
    expect(chip).toHaveClass("focus-visible:outline-[color:var(--section-focus-ring)]");
    await userEvent.click(chip);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("Badge remains non-interactive content", () => {
    render(<Badge variant="emphasis">Awarded</Badge>);

    expect(screen.getByText("Awarded")).toHaveAttribute("data-slot", "badge");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
