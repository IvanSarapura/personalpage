"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";

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
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const THEME_TRANSITION_CLASS = "theme-transitioning";
const THEME_CHANGE_EVENT = "themechange";
const THEME_STORAGE_KEY = "theme";

function readCssDurationMs(element: Element, property: string): number {
  const value = window.getComputedStyle(element).getPropertyValue(property).trim();
  const duration = Number.parseFloat(value);

  if (!Number.isFinite(duration)) return 0;
  return value.endsWith("ms") ? duration : value.endsWith("s") ? duration * 1000 : 0;
}

function getThemeFromDOM(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function readStoredTheme(): Theme | null {
  try {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    return theme === "dark" || theme === "light" ? theme : null;
  } catch {
    return null;
  }
}

function resolveTheme(
  storedTheme = readStoredTheme(),
  sessionTheme: Theme | null = null,
  systemDark = typeof window.matchMedia === "function" && window.matchMedia(MEDIA_QUERY).matches
): Theme {
  return sessionTheme ?? storedTheme ?? (systemDark ? "dark" : "light");
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

function persistTheme(theme: Theme): boolean {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    return true;
  } catch {
    // localStorage no disponible (modo privado o cuota excedida): se ignora.
    return false;
  }
}

function notifyThemeChange() {
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT));
}

function subscribe(onStoreChange: () => void, sessionThemeRef: { current: Theme | null }) {
  const media = typeof window.matchMedia === "function" ? window.matchMedia(MEDIA_QUERY) : null;

  const handleMedia = (event: MediaQueryListEvent) => {
    const storedTheme = readStoredTheme();
    if (storedTheme || sessionThemeRef.current) return;

    applyTheme(resolveTheme(storedTheme, sessionThemeRef.current, event.matches));
    onStoreChange();
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY || e.key === null) {
      sessionThemeRef.current =
        e.key === THEME_STORAGE_KEY && (e.newValue === "dark" || e.newValue === "light")
          ? e.newValue
          : null;

      applyTheme(resolveTheme(readStoredTheme(), sessionThemeRef.current));
      onStoreChange();
    }
  };

  const handleThemeChange = () => onStoreChange();

  media?.addEventListener("change", handleMedia);
  window.addEventListener("storage", handleStorage);
  window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);

  return () => {
    media?.removeEventListener("change", handleMedia);
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  };
}

/* ──────────────────────────────────────────────────────────────
   ThemeProvider
   ────────────────────────────────────────────────────────────── */

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const clearThemeTransitionRef = useRef<(() => void) | null>(null);
  const sessionThemeRef = useRef<Theme | null>(null);

  const subscribeToTheme = useCallback(
    (onStoreChange: () => void) => subscribe(onStoreChange, sessionThemeRef),
    []
  );

  const theme = useSyncExternalStore<Theme>(
    subscribeToTheme,
    getThemeFromDOM,
    () => "light" // getServerSnapshot — SSR siempre renderiza "light"
  );

  const startThemeTransition = useCallback(() => {
    const html = document.documentElement;
    clearThemeTransitionRef.current?.();

    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia(REDUCED_MOTION_QUERY).matches
    ) {
      return;
    }

    html.classList.add(THEME_TRANSITION_CLASS);

    const transitionDurationMs = readCssDurationMs(html, "--duration-slow");

    const timeoutId = window.setTimeout(() => {
      clearThemeTransitionRef.current?.();
    }, transitionDurationMs);

    clearThemeTransitionRef.current = () => {
      window.clearTimeout(timeoutId);
      html.classList.remove(THEME_TRANSITION_CLASS);
      clearThemeTransitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => clearThemeTransitionRef.current?.();
  }, []);

  const setTheme = useCallback(
    (next: Theme) => {
      startThemeTransition();

      applyTheme(next);
      sessionThemeRef.current = persistTheme(next) ? null : next;

      // `storage` se reserva para cambios reales de otras pestañas. Esta señal
      // interna conserva el tema local aunque localStorage no esté disponible.
      notifyThemeChange();
    },
    [startThemeTransition]
  );

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
