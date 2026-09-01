import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import ErrorPage from "../error";
import styles from "../error.module.css";

vi.mock("next/navigation", () => ({ usePathname: () => "/en/projects" }));

describe("localized error boundary", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("provides a programmatically focusable target for the layout skip link", () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    render(<ErrorPage error={new Error("expected test failure")} unstable_retry={vi.fn()} />);

    const main = screen.getByRole("main", { name: "Something went wrong" });
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveAttribute("tabindex", "-1");
    expect(screen.getByRole("heading", { name: "Something went wrong" }).parentElement).toHaveClass(
      styles.content!
    );
  });

  it("keeps the retry action operable", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const unstableRetry = vi.fn();
    const user = userEvent.setup();

    render(<ErrorPage error={new Error("expected test failure")} unstable_retry={unstableRetry} />);

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(unstableRetry).toHaveBeenCalledOnce();
  });
});
