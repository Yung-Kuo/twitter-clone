// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase",
    "@pinia//nuxt",
    "@nuxtjs/google-fonts",
  ],
  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    },
  },
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      "defineStore", // import { defineStore } from 'pinia'
      ["defineStore", "definePiniaStore"], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
  googleFonts: {
    families: {
      Ubuntu: {
        wght: [300, 400, 500, 700],
        ital: [300, 400, 500, 700],
      },
      Varela: true,
      "Open Sans": {
        wght: "300..800",
        ital: "200..700",
      },
    },
    display: "swap", // 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  },

  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
});
