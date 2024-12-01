import globals from "globals";
import js from "@eslint/js";

export default [
  {
    env: {
      browser: true,
      node: true
  },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: { ...globals.node },
    },
  },
  js.configs.recommended,
];
