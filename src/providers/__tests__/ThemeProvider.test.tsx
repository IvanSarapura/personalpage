import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeProvider from "../ThemeProvider";
import { useTheme } from "../useTheme";

function Consumer() {
  const { theme, isDark, toggleTheme } = useTheme();
  return (
    <>
      <span data-testid="theme">{theme}</span>
      <span data-testid="isDark">{String(isDark)}</span>
      <button onClick={toggleTheme}>toggle</button>
    </>
  );
}

function renderProvider() {
  return render(
    <ThemeProvider>
      <Consumer />
    </ThemeProvider>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
    localStorage.clear();
    // jsdom no implementa matchMedia; el provider lo usa en subscribe().
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockReturnValue({
        matches: false,
        media: "(prefers-color-scheme: dark)",
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.classList.remove("dark");
    localStorage.clear();
  });

  it("por defecto resuelve el tema 'light'", () => {
    renderProvider();
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(screen.getByTestId("isDark")).toHaveTextContent("false");
  });

  it("refleja 'dark' cuando <html> ya tiene la clase dark", () => {
    document.documentElement.classList.add("dark");
    renderProvider();
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(screen.getByTestId("isDark")).toHaveTextContent("true");
  });

  it("toggleTheme de light a dark actualiza el DOM y localStorage", async () => {
    renderProvider();
    await userEvent.click(screen.getByRole("button", { name: "toggle" }));

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("toggleTheme de dark a light actualiza el DOM y localStorage", async () => {
    document.documentElement.classList.add("dark");
    renderProvider();
    await userEvent.click(screen.getByRole("button", { name: "toggle" }));

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem("theme")).toBe("light");
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("useTheme lanza un error fuera de un ThemeProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow(/within a ThemeProvider/);
    consoleError.mockRestore();
  });
});
