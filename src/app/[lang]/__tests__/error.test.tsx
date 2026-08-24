import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import ErrorPage from "../error";

vi.mock("next/navigation", () => ({ usePathname: () => "/en/projects" }));

describe("localized error boundary", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("provides a programmatically focusable target for the layout skip link", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(<ErrorPage error={new Error("expected test failure")} reset={vi.fn()} />);

    const main = screen.getByRole("main", { name: "Something went wrong" });
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveAttribute("tabindex", "-1");
  });
});
