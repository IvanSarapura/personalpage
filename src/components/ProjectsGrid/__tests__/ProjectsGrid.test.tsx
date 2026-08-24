import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import ProjectsGrid from "../ProjectsGrid";

describe("ProjectsGrid filters", () => {
  it("uses toggle-button semantics and updates the pressed filter", async () => {
    render(<ProjectsGrid locale="en" />);

    const all = screen.getByRole("button", { name: "All", pressed: true });
    const web3 = screen.getByRole("button", { name: "Web3", pressed: false });

    expect(all).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(web3);
    expect(web3).toHaveAttribute("aria-pressed", "true");
    expect(all).toHaveAttribute("aria-pressed", "false");
  });
});
