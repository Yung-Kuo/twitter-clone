// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase",
    "@pinia//nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/google-fonts",
  ],
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      "defineStore", // import { defineStore } from 'pinia'
      ["defineStore", "definePiniaStore"], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
  googleFonts: {
    families: {
      "Open Sans": {
        wght: "300..800",
        ital: "200..700",
      },
      Montserrat: {
        wght: "200..900",
        ital: "200..700",
      },
      Poppins: {
        wght: "200..900",
        ital: "200..700",
      },
      "Work Sans": {
        wght: "200..900",
        ital: "200..700",
      },
    },
    display: "swap", // 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  },

  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
});
