export default defineNuxtPlugin(async () => {
  // Only run on client side to avoid SSR serialization issues
  if (import.meta.server) return
  
  const authStore = useAuthStore()
  
  // Initialize auth state on app start
  if (!authStore.initialized) {
    await authStore.initialize()
  }
})

