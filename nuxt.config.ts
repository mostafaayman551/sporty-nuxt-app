// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/ui',
    '@element-plus/nuxt',
    '@vueuse/motion/nuxt',
    '@pinia/nuxt'
  ],
  build: {
    transpile: ['pinia']
  },
  runtimeConfig: {
    // Private keys (only available on server-side)
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    // Public keys (exposed to client-side)
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'http://localhost:3000',
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      githubClientId: process.env.NUXT_PUBLIC_GITHUB_CLIENT_ID || ''
    }
  }
})
// Force reload: 1