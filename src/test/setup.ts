import "@testing-library/jest-dom";
import { afterEach, vi } from "vitest";

const scrollToMock = vi.fn();

Object.defineProperty(window, "scrollTo", {
  configurable: true,
  writable: true,
  value: scrollToMock,
});

afterEach(() => {
  scrollToMock.mockClear();
});
