import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useLockBodyScroll } from "../useLockBodyScroll";

describe("useLockBodyScroll", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
  });

  it("does not lock body when locked=false", () => {
    renderHook(() => useLockBodyScroll(false));
    expect(document.body.style.overflow).toBe("");
  });

  it("sets overflow hidden when locked=true", () => {
    renderHook(() => useLockBodyScroll(true));
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores overflow on unmount", () => {
    document.body.style.overflow = "auto";
    const { unmount } = renderHook(() => useLockBodyScroll(true));
    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("restores the original scroll position on unmount", () => {
    Object.defineProperty(window, "scrollY", { configurable: true, value: 240 });
    const { unmount } = renderHook(() => useLockBodyScroll(true));

    unmount();

    expect(window.scrollTo).toHaveBeenCalledWith(0, 240);
  });

  it("restores overflow when locked changes from true to false", () => {
    const { rerender } = renderHook(({ locked }) => useLockBodyScroll(locked), {
      initialProps: { locked: true },
    });
    expect(document.body.style.overflow).toBe("hidden");
    rerender({ locked: false });
    expect(document.body.style.overflow).toBe("");
  });
});
