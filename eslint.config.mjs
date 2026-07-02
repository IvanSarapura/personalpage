import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Reglas de accesibilidad completas (Next solo trae un subconjunto). Se
      // aplican las reglas del recommended sin redeclarar el plugin, que
      // eslint-config-next ya registra como "jsx-a11y".
      ...jsxA11y.flatConfigs.recommended.rules,
      // Imports de solo-tipo explícitos (`import type`).
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
