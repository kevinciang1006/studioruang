import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import astroPlugin from "eslint-plugin-astro";
import reactPlugin from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

export default [
  {
    // Global ignores. Must stay a standalone { ignores } entry (no `files` key) so it
    // applies before any other config, including the design-reference export dropped in
    // by Claude Design (its support.js is a large, non-project script we never lint).
    ignores: [
      "dist/",
      ".astro/",
      ".vercel/",
      "node_modules/",
      "coverage/",
      "Studio Ruang homepage direction/",
      "*.zip",
    ],
  },
  js.configs.recommended,
  ...astroPlugin.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      globals: { ...globals.browser, ...globals.node, ...globals.es2021 },
    },
    plugins: { "@typescript-eslint": tseslint, react: reactPlugin, "jsx-a11y": jsxA11y },
    rules: {
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
    },
  },
  {
    // Non-null assertions on fixed-shape test fixtures (`sample[0]!`) are fine — this is
    // the one place the blanket "no non-null assertions" rule (see CLAUDE.md) is relaxed.
    files: ["**/*.test.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  {
    // Ambient declaration files legitimately use triple-slash references (this is the
    // documented way to pull in Astro's generated types).
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
];
