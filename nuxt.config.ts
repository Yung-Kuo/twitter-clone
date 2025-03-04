// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase",
    "@pinia/nuxt",
    "@nuxtjs/google-fonts",
    "@nuxt/scripts",
    "@nuxtjs/turnstile",
  ],

  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      },
    },
  },

  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      include: undefined,
      exclude: [],
      cookieRedirect: false,
    },
    cookieOptions: {
      maxAge: 60 * 60 * 8,
      sameSite: "lax",
      // secure: true,
      secure: process.env.NODE_ENV === "production",
    },
  },

  pinia: {
    // autoImports: [
    //   // automatically imports `defineStore`
    //   "defineStore", // import { defineStore } from 'pinia'
    //   ["defineStore", "definePiniaStore"], // import { defineStore as definePiniaStore } from 'pinia'
    // ],
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

  turnstile: {
    siteKey: "0x4AAAAAAA_eb1YrbgvOlalr",
  },

  runtimeConfig: {
    public: {
      baseURL:
        process.env.NODE_ENV === "production"
          ? process.env.BASE_URL_PRODUCTION
          : "http://localhost:3000",
    },
    turnstile: {
      // This can be overridden at runtime via the NUXT_TURNSTILE_SECRET_KEY
      // environment variable.
      secretKey: "0x4AAAAAAA_eb7n83bbFE-LD6NBHfXIL4JE",
    },
  },

  compatibilityDate: "2025-03-04",
});
