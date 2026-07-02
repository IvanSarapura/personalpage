"use client";

import { createContext, useContext, useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}

/* ──────────────────────────────────────────────────────────────
   Store externo: lee el tema real del DOM (localStorage + system)
   y notifica a useSyncExternalStore cuando cambia.
   El script inline en <head> ya seteó la clase "dark" antes
   de la hidratación, así que el primer snapshot es correcto.
   ────────────────────────────────────────────────────────────── */

const MEDIA_QUERY = "(prefers-color-scheme: dark)";

function getThemeFromDOM(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia(MEDIA_QUERY);

  const handleMedia = () => {
    try {
      const hasStored = localStorage.getItem("theme");
      if (!hasStored) {
        onStoreChange();
      }
    } catch {
      onStoreChange();
    }
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === "theme") {
      onStoreChange();
    }
  };

  media.addEventListener("change", handleMedia);
  window.addEventListener("storage", handleStorage);

  return () => {
    media.removeEventListener("change", handleMedia);
    window.removeEventListener("storage", handleStorage);
  };
}

/* ──────────────────────────────────────────────────────────────
   ThemeProvider
   ────────────────────────────────────────────────────────────── */

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useSyncExternalStore<Theme>(
    subscribe,
    getThemeFromDOM,
    () => "light" // getServerSnapshot — SSR siempre renderiza "light"
  );

  const setTheme = useCallback((next: Theme) => {
    const html = document.documentElement;

    if (next === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    try {
      localStorage.setItem("theme", next);
    } catch {
      // localStorage no disponible (modo privado o cuota excedida): se ignora.
    }

    // Notificar a otras pestañas mediante un storage event.
    window.dispatchEvent(new StorageEvent("storage", { key: "theme", newValue: next }));
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
  }, [theme, setTheme]);

  const value: ThemeContextValue = {
    theme,
    toggleTheme,
    isDark: theme === "dark",
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
