import process from 'node:process'

export default defineNuxtConfig({
  compatibilityDate: '2026-09-17',
  devtools: {
    enabled: true,
  },

  modules: ['@nuxtjs/color-mode', ...(process.env.VERCEL ? ['@vercel/analytics'] : [])],

  css: ['~/assets/css/main.css'],

  nitro: {
    compressPublicAssets: true,
  },

  routeRules: {
    '/': { prerender: true },
    '/images/**': { headers: { 'cache-control': 'public, max-age=2592000' } },
    '/fonts/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
  },

  colorMode: {
    preference: 'system',
    fallback: 'dark',
    classSuffix: '',
    storageKey: 'ralph-portfolio-theme',
  },
})
