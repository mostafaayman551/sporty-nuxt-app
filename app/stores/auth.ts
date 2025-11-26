import { defineStore } from 'pinia'

interface UserProfile {
  id: string
  email: string
  name: string | null
  role: string
  avatarUrl: string | null
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as UserProfile | null,
    loading: false,
    initialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userRole: (state) => state.user?.role || 'Guest',
    userName: (state) => state.user?.name || state.user?.email?.split('@')[0] || 'User',
    userInitials: (state) => {
      const name = state.user?.name || state.user?.email || 'U'
      const parts = name.split(' ')
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }
  },

  actions: {
    async initialize() {
      if (this.initialized) return
      
      try {
        const { data, error } = await useFetch('/api/auth/me', {
          credentials: 'include', // Ensure cookies are sent
          server: true, // Ensure this runs on server during SSR
          lazy: false // Don't lazy load - we need the result immediately
        })
        
        if (error.value) {
          // Clear user if unauthorized (401 or any error)
          this.user = null
        } else if (data.value?.user) {
          // Create a plain object to avoid serialization issues
          this.user = {
            id: data.value.user.id,
            email: data.value.user.email,
            name: data.value.user.name,
            role: data.value.user.role,
            avatarUrl: data.value.user.avatarUrl
          }
        } else {
          this.user = null
        }
      } catch (e) {
        // On any error, clear user
        this.user = null
      } finally {
        // Always mark as initialized, even on error
        this.initialized = true
      }
    },

    async signIn(email: string, password: string) {
      this.loading = true
      
      try {
        const { data, error } = await useFetch('/api/auth/login', {
          method: 'POST',
          body: { email, password },
          credentials: 'include' // Ensure cookies are sent and received
        })
        
        if (error.value) {
          throw error.value
        }
        
        if (data.value?.user) {
          // Create a plain object to avoid serialization issues
          this.user = {
            id: data.value.user.id,
            email: data.value.user.email,
            name: data.value.user.name,
            role: data.value.user.role,
            avatarUrl: data.value.user.avatarUrl
          }
          
          // Token is already set in cookie by server
          // Only set client-side cookie if we're in browser
          if (import.meta.client && data.value.token) {
            const tokenCookie = useCookie('auth_token', {
              maxAge: 60 * 60 * 24 * 7, // 7 days
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              httpOnly: false
            })
            tokenCookie.value = data.value.token
          }
          
          return { error: null }
        }
        
        throw new Error('Login failed: No user data received')
      } catch (e: any) {
        return { error: e }
      } finally {
        this.loading = false
      }
    },

    async signUp(email: string, password: string, fullName: string) {
      this.loading = true
      
      try {
        const { data, error } = await useFetch('/api/auth/register', {
          method: 'POST',
          body: { email, password, fullName }
        })
        
        if (error.value) throw error.value
        
        // Registration doesn't automatically log in - user needs to verify email first
        // Return success message instead of setting user
        if (data.value?.message) {
          return { error: null, message: data.value.message }
        }
        
        return { error: null }
      } catch (e: any) {
        return { error: e }
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      try {
        await useFetch('/api/auth/logout', { 
          method: 'POST',
          credentials: 'include'
        })
        
        // Clear client-side token cookie (only in browser)
        if (import.meta.client) {
          const tokenCookie = useCookie('auth_token')
          tokenCookie.value = null
        }
        
        this.user = null
        this.initialized = false
        
        if (import.meta.client) {
          await navigateTo('/auth/login')
        }
      } catch (error) {
        // Even if logout fails, clear local state
        if (import.meta.client) {
          const tokenCookie = useCookie('auth_token')
          tokenCookie.value = null
        }
        this.user = null
        this.initialized = false
        
        if (import.meta.client) {
          await navigateTo('/auth/login')
        }
      }
    }
  }
})
