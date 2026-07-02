import { useThemeContext } from "./ThemeProvider";

export function useTheme() {
  return useThemeContext();
}

// Re-exportar para conveniencia
export type { Theme } from "./ThemeProvider";
