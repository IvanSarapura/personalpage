import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { scrollToTopInstantly, smoothScrollTo } from "@/lib/smooth-scroll";

describe("smoothScrollTo", () => {
  const originalMatchMedia = window.matchMedia;
  const originalScrollY = window.scrollY;
  const originalRequestAnimationFrame = window.requestAnimationFrame;
  const originalCancelAnimationFrame = window.cancelAnimationFrame;
  const originalScrollTo = window.scrollTo;
  const originalScrollBehavior = document.documentElement.style.scrollBehavior;

  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    window.cancelAnimationFrame = vi.fn();
  });

  afterEach(() => {
    Object.defineProperty(window, "scrollY", { configurable: true, value: originalScrollY });
    window.matchMedia = originalMatchMedia;
    window.requestAnimationFrame = originalRequestAnimationFrame;
    window.cancelAnimationFrame = originalCancelAnimationFrame;
    window.scrollTo = originalScrollTo;
    document.documentElement.style.scrollBehavior = originalScrollBehavior;
  });

  it("llega al destino mediante frames de animación", () => {
    let frame: FrameRequestCallback | undefined;
    window.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      frame = callback;
      return 1;
    });

    smoothScrollTo(240);
    frame?.(performance.now() + 450);

    expect(window.scrollTo).toHaveBeenLastCalledWith(0, 240);
  });

  it("no anima cuando el usuario prefiere movimiento reducido", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });
    window.requestAnimationFrame = vi.fn();

    smoothScrollTo(240);

    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 240, behavior: "auto" });
  });

  it("restablece el inicio sin heredar el scroll suave global", () => {
    document.documentElement.style.scrollBehavior = "smooth";
    const scrollToSpy = vi.fn(() => {
      expect(document.documentElement.style.scrollBehavior).toBe("auto");
    });
    window.scrollTo = scrollToSpy;

    scrollToTopInstantly();

    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });
    expect(document.documentElement.style.scrollBehavior).toBe("smooth");
  });
});
