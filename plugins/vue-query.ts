import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";

export default defineNuxtPlugin({
  name: "vue-query",
  enforce: "pre",
  setup(nuxtApp) {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60_000,
        },
      },
    });

    nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });

    return {
      provide: {
        queryClient,
      },
    };
  },
});
