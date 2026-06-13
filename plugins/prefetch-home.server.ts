import type { QueryClient } from "@tanstack/vue-query";

/** SSR prefetch for authenticated home (Phase 6c) — runs in plugin context, not after setup await. */
export default defineNuxtPlugin({
  name: "nuxt:prefetch-home",
  enforce: "post",
  dependsOn: ["vue-query"],
  async setup(nuxtApp) {
    const route = useRoute();
    if (route.path !== "/") return;

    const event = useRequestEvent();
    if (!event) return;

    const queryClient = nuxtApp.$queryClient as QueryClient | undefined;
    if (!queryClient) return;

    const { prefetchHomePage } = await import(
      "~/queries/server/prefetchHomePage.server"
    );
    await prefetchHomePage(event, queryClient);
  },
});
