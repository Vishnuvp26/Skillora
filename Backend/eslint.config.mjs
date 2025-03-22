import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.node,
    },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];  