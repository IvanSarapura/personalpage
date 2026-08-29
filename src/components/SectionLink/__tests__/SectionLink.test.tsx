import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SectionLink from "../SectionLink";

describe("SectionLink", () => {
  it("renders internal navigation with an arrow", () => {
    render(<SectionLink href="/research">Research</SectionLink>);

    expect(screen.getByRole("link", { name: "Research" })).toHaveAttribute("href", "/research");
  });

  it("renders the left arrow variant for back navigation", () => {
    render(
      <SectionLink href="/blog" icon="arrowLeft">
        All posts
      </SectionLink>
    );

    expect(screen.getByRole("link", { name: "All posts" }).querySelector("svg")).toBeTruthy();
  });

  it("announces and secures external links opened in a new tab", () => {
    render(
      <SectionLink href="https://example.com" external opensInNewTabLabel="opens in a new tab">
        Evidence
      </SectionLink>
    );

    expect(screen.getByRole("link", { name: "Evidence (opens in a new tab)" })).toMatchObject({
      target: "_blank",
      rel: "noopener noreferrer",
    });
  });
});
