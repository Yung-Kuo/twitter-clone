import path from "node:path";
import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

const root = path.dirname(fileURLToPath(import.meta.url));

/** Use `defineVitestConfig` from @nuxt/test-utils/config for component tests (nuxt env). */
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "~": root,
      "~~": root,
    },
  },
  test: {
    environment: "happy-dom",
    include: ["tests/**/*.{test,spec}.ts"],
    coverage: {
      provider: "v8",
      include: ["schemas/**", "queries/**", "composables/**"],
    },
  },
});
