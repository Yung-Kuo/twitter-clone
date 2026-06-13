import {
  QueryClient,
  VueQueryPlugin,
  dehydrate,
  hydrate,
  type DehydratedState,
} from "@tanstack/vue-query";

export default defineNuxtPlugin({
  name: "vue-query",
  setup(nuxtApp) {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60_000,
        },
      },
    });

    const vueQueryState = useState<DehydratedState | null>(
      "vue-query-state",
      () => null,
    );

    if (import.meta.server) {
      nuxtApp.hook("app:rendered", () => {
        vueQueryState.value = dehydrate(queryClient);
      });
    }

    if (import.meta.client && vueQueryState.value) {
      hydrate(queryClient, vueQueryState.value);
    }

    nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });

    return {
      provide: {
        queryClient,
      },
    };
  },
});
