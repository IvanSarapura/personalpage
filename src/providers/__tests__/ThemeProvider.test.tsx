import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeProvider from "../ThemeProvider";
import { useTheme } from "../useTheme";

let systemMediaChangeListener: ((event: MediaQueryListEvent) => void) | undefined;
let systemDark = false;

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
    systemMediaChangeListener = undefined;
    systemDark = false;
    // jsdom no implementa matchMedia; el provider lo usa en subscribe().
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((media: string) => ({
        matches: media === "(prefers-color-scheme: dark)" ? systemDark : false,
        media,
        onchange: null,
        addEventListener: vi.fn((event: string, listener: (event: MediaQueryListEvent) => void) => {
          if (media === "(prefers-color-scheme: dark)" && event === "change") {
            systemMediaChangeListener = listener;
          }
        }),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.remove("theme-transitioning");
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

  it("mantiene dark guardado cuando el script inicial ya aplicó html.dark", () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
    renderProvider();

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveClass("dark");
  });

  it("mantiene light guardado aunque el sistema prefiera dark", () => {
    systemDark = true;
    localStorage.setItem("theme", "light");
    renderProvider();

    act(() => systemMediaChangeListener?.({ matches: true } as MediaQueryListEvent));

    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(document.documentElement).not.toHaveClass("dark");
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

  it("activa la transición temporal solo durante un toggle y la limpia", () => {
    vi.useFakeTimers();
    renderProvider();

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));
    expect(document.documentElement).toHaveClass("theme-transitioning");

    act(() => vi.advanceTimersByTime(350));
    expect(document.documentElement).not.toHaveClass("theme-transitioning");
  });

  it("reinicia la limpieza de transición ante toggles consecutivos", () => {
    vi.useFakeTimers();
    renderProvider();
    const toggle = screen.getByRole("button", { name: "toggle" });

    fireEvent.click(toggle);
    act(() => vi.advanceTimersByTime(200));
    fireEvent.click(toggle);
    act(() => vi.advanceTimersByTime(200));

    expect(document.documentElement).toHaveClass("theme-transitioning");

    act(() => vi.advanceTimersByTime(150));
    expect(document.documentElement).not.toHaveClass("theme-transitioning");
  });

  it("no activa la transición si se prefiere movimiento reducido", () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn().mockImplementation((media: string) => ({
        matches: media === "(prefers-reduced-motion: reduce)",
        media,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );
    renderProvider();

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));
    expect(document.documentElement).not.toHaveClass("theme-transitioning");
  });

  it("sin preferencia persistida, aplica el cambio del sistema al DOM antes de actualizar el estado", () => {
    renderProvider();

    act(() => systemMediaChangeListener?.({ matches: true } as MediaQueryListEvent));

    expect(document.documentElement).toHaveClass("dark");
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement).not.toHaveClass("theme-transitioning");
  });

  it("un evento storage aplica el tema persistido al DOM sin animación antes de actualizar el estado", () => {
    renderProvider();
    localStorage.setItem("theme", "dark");

    act(() =>
      window.dispatchEvent(new StorageEvent("storage", { key: "theme", newValue: "dark" }))
    );

    expect(document.documentElement).toHaveClass("dark");
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement).not.toHaveClass("theme-transitioning");
  });

  it("al eliminar una preferencia externa vuelve al tema del sistema sin animación", () => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    renderProvider();
    localStorage.removeItem("theme");

    act(() => window.dispatchEvent(new StorageEvent("storage", { key: "theme", newValue: null })));

    expect(document.documentElement).not.toHaveClass("dark");
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(document.documentElement).not.toHaveClass("theme-transitioning");
  });

  it("con localStorage bloqueado conserva el tema local y actualiza el estado", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage blocked", "SecurityError");
    });
    renderProvider();

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));

    expect(setItem).toHaveBeenCalledWith("theme", "dark");
    expect(document.documentElement).toHaveClass("dark");
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(document.documentElement).toHaveClass("theme-transitioning");
  });

  it("con localStorage bloqueado conserva la preferencia manual ante cambios del sistema", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage blocked", "SecurityError");
    });
    renderProvider();

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));
    act(() => systemMediaChangeListener?.({ matches: false } as MediaQueryListEvent));

    expect(document.documentElement).toHaveClass("dark");
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("con localStorage completamente no disponible conserva el toggle local", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Storage blocked", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage blocked", "SecurityError");
    });
    renderProvider();

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));
    act(() => systemMediaChangeListener?.({ matches: false } as MediaQueryListEvent));

    expect(document.documentElement).toHaveClass("dark");
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("un storage externo reemplaza la preferencia manual temporal", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage blocked", "SecurityError");
    });
    renderProvider();

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));
    act(() =>
      window.dispatchEvent(new StorageEvent("storage", { key: "theme", newValue: "light" }))
    );
    act(() => systemMediaChangeListener?.({ matches: true } as MediaQueryListEvent));

    expect(document.documentElement).not.toHaveClass("dark");
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("localStorage.clear() externo elimina la preferencia temporal y vuelve al sistema", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage blocked", "SecurityError");
    });
    renderProvider();

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));
    act(() => window.dispatchEvent(new StorageEvent("storage", { key: null })));

    expect(document.documentElement).not.toHaveClass("dark");
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("sin matchMedia usa el fallback claro de forma determinística", () => {
    vi.stubGlobal("matchMedia", undefined);
    document.documentElement.classList.add("dark");
    renderProvider();

    act(() => window.dispatchEvent(new StorageEvent("storage", { key: null })));

    expect(document.documentElement).not.toHaveClass("dark");
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("notifica el toggle local mediante CustomEvent", () => {
    const handleThemeChange = vi.fn();
    window.addEventListener("themechange", handleThemeChange);
    renderProvider();

    fireEvent.click(screen.getByRole("button", { name: "toggle" }));

    expect(handleThemeChange).toHaveBeenCalledWith(expect.any(CustomEvent));
    window.removeEventListener("themechange", handleThemeChange);
  });

  it("useTheme lanza un error fuera de un ThemeProvider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow(/within a ThemeProvider/);
    consoleError.mockRestore();
  });
});
