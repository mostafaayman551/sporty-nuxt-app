import { defineStore } from 'pinia'

/**
 * User store
 * 
 * NOTE: Currently simplified to avoid Pinia serialization issues with Supabase.
 * Use useSupabaseUser() and useSupabaseClient() composables directly in components instead.
 */
export const useUserStore = defineStore('user', () => {
  // TODO: Add user state management here when needed
  // For now, use Supabase composables directly in components
  
  return {
    // Empty store for now
  }
})
