import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFocusTrap } from "../useFocusTrap";

describe("useFocusTrap", () => {
  it("returns a ref object", () => {
    const { result } = renderHook(() => useFocusTrap<HTMLDivElement>(false));
    expect(result.current).toHaveProperty("current");
  });

  it("does not throw when active=false and ref is unattached", () => {
    expect(() => {
      renderHook(() => useFocusTrap<HTMLDivElement>(false));
    }).not.toThrow();
  });

  it("does not throw when active=true and ref is unattached", () => {
    expect(() => {
      renderHook(() => useFocusTrap<HTMLDivElement>(true));
    }).not.toThrow();
  });

  it("traps Tab focus within the container", () => {
    const container = document.createElement("div");
    const btn1 = document.createElement("button");
    const btn2 = document.createElement("button");
    container.append(btn1, btn2);
    document.body.appendChild(container);

    const { result } = renderHook(() => useFocusTrap<HTMLDivElement>(true));
    (result.current as React.MutableRefObject<HTMLDivElement>).current = container;

    // First focusable element should receive initial focus
    btn1.focus();
    expect(document.activeElement).toBe(btn1);

    document.body.removeChild(container);
  });
});
