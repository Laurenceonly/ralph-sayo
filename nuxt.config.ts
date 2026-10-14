export default defineNuxtConfig({
  compatibilityDate: '2026-09-17',
  devtools: {
    enabled: true,
  },

  modules: ['@nuxtjs/color-mode', '@vercel/analytics'],

  css: ['~/assets/css/main.css'],

  hooks: {
    'build:manifest': (manifest) => {
      // These chunks are requested by initializeMotion when motion is enabled.
      // Nuxt's automatic prefetch otherwise downloads them on reduced-motion visits too.
      for (const [id, chunk] of Object.entries(manifest)) {
        if (id.replaceAll('\\', '/').includes('/gsap/')) chunk.prefetch = false
      }
    },
  },

  colorMode: {
    preference: 'system',
    fallback: 'dark',
    classSuffix: '',
    storageKey: 'ralph-portfolio-theme',
  },
})
