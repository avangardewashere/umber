import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// The wall. src/ui is the library; a copied component must never drag the website along.
const wallMessage =
  "src/ui is the library. It must not import from src/site or src/app. Move shared code into src/ui.";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/site",
                "@/site/*",
                "@/site/**",
                "@/app",
                "@/app/*",
                "@/app/**",
                "**/site/*",
                "**/site/**",
                "**/app/*",
                "**/app/**",
              ],
              message: wallMessage,
            },
          ],
        },
      ],
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
