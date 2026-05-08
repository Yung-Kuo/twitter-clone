import { defineConfig } from "vitest/config";

/** Use `defineVitestConfig` from @nuxt/test-utils/config for component tests (nuxt env). */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.{test,spec}.ts"],
    coverage: {
      provider: "v8",
      include: ["schemas/**", "queries/**", "composables/**"],
    },
  },
});
