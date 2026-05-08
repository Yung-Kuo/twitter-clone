import withNuxt from "./.nuxt/eslint.config.mjs";

/** @see https://nuxt.com/docs/guide/concepts/code-style#eslint */
export default withNuxt(
  {
    name: "project/ignores",
    ignores: [".output/**", "dist/**", "coverage/**", "node_modules/**"],
  },
  {
    name: "project/rules",
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
);
