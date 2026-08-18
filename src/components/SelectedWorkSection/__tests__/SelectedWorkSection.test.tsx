import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SelectedWorkSection from "@/components/SelectedWorkSection/SelectedWorkSection";

describe("SelectedWorkSection", () => {
  it("enlaza al índice de casos con un chevron únicamente visual", () => {
    render(<SelectedWorkSection locale="en" />);

    const indexLink = screen.getByRole("link", { name: "All case studies" });

    expect(indexLink).toHaveAttribute("href", "/projects");
    expect(indexLink.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });
});
