import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "../Switch";

describe("Switch", () => {
  it("renders a button with role=switch", () => {
    render(<Switch checked={false} onChange={() => {}} ariaLabel="Enable dark mode" />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("reflects checked=false via aria-checked", () => {
    render(<Switch checked={false} onChange={() => {}} ariaLabel="Enable dark mode" />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
  });

  it("reflects checked=true via aria-checked", () => {
    render(<Switch checked={true} onChange={() => {}} ariaLabel="Enable dark mode" />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange when clicked", async () => {
    const onChange = vi.fn();
    render(<Switch checked={false} onChange={onChange} ariaLabel="Enable dark mode" />);
    await userEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("calls onChange when Space is pressed", async () => {
    const onChange = vi.fn();
    render(<Switch checked={false} onChange={onChange} ariaLabel="Enable dark mode" />);
    screen.getByRole("switch").focus();
    await userEvent.keyboard(" ");
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("calls onChange when Enter is pressed", async () => {
    const onChange = vi.fn();
    render(<Switch checked={false} onChange={onChange} ariaLabel="Enable dark mode" />);
    screen.getByRole("switch").focus();
    await userEvent.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("does not call onChange when disabled", async () => {
    const onChange = vi.fn();
    render(
      <Switch checked={false} onChange={onChange} ariaLabel="Enable dark mode" disabled={true} />
    );
    await userEvent.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("has the correct aria-label", () => {
    render(<Switch checked={false} onChange={() => {}} ariaLabel="Switch to dark mode" />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-label", "Switch to dark mode");
  });

  it("keeps its accessible name stable when state changes", () => {
    const { rerender } = render(
      <Switch checked={false} onChange={() => {}} ariaLabel="Color theme" />
    );
    expect(screen.getByRole("switch", { name: "Color theme" })).toHaveAttribute(
      "aria-checked",
      "false"
    );

    rerender(<Switch checked onChange={() => {}} ariaLabel="Color theme" />);
    expect(screen.getByRole("switch", { name: "Color theme" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });

  it("forwards ariaDescribedby", () => {
    render(
      <Switch
        checked={false}
        onChange={() => {}}
        ariaLabel="Enable dark mode"
        ariaDescribedby="hint-text"
      />
    );
    expect(screen.getByRole("switch")).toHaveAttribute("aria-describedby", "hint-text");
  });
});
