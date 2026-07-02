import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrolled, DEFAULT_SCROLL_THRESHOLD } from "../useScrolled";

describe("useScrolled", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: 0 });
    vi.useFakeTimers();
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("returns false when scroll is at 0", () => {
    const { result } = renderHook(() => useScrolled());
    expect(result.current).toBe(false);
  });

  it("returns true when scrollY exceeds default threshold", () => {
    Object.defineProperty(window, "scrollY", { value: 10 });
    const { result } = renderHook(() => useScrolled());
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(true);
  });

  it("returns false when scrollY equals threshold (not exceeds)", () => {
    Object.defineProperty(window, "scrollY", { value: DEFAULT_SCROLL_THRESHOLD });
    const { result } = renderHook(() => useScrolled());
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(false);
  });

  it("respects a custom threshold", () => {
    Object.defineProperty(window, "scrollY", { value: 50 });
    const { result } = renderHook(() => useScrolled(100));
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe(false);
  });

  it("cleans up the scroll listener on unmount", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useScrolled());
    unmount();
    expect(addSpy).toHaveBeenCalledWith("scroll", expect.any(Function), { passive: true });
    expect(removeSpy).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
