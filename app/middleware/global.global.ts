export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware for API routes (they handle their own auth)
  if (to.path.startsWith('/api/')) {
    return
  }
  
  const authStore = useAuthStore()
  
  // Define public routes that don't require authentication
  const publicRoutes = [
    '/auth/login', 
    '/auth/forgot-password', 
    '/auth/signup',
    '/auth/confirm-email',
    '/auth/reset-password'
  ]
  
  // Check if the current route is a public route
  const isPublicRoute = publicRoutes.includes(to.path)
  
  // Initialize auth if not done yet
  // Force re-initialization if coming from OAuth callback (check query params)
  const isOAuthCallback = to.query.oauth === 'success' || to.query.code || to.query.state
  
  if (!authStore.initialized || isOAuthCallback) {
    await authStore.initialize(isOAuthCallback)
    
    // If OAuth callback, clean up the query parameter after initialization
    if (isOAuthCallback && to.query.oauth === 'success') {
      // Remove oauth query parameter and redirect to clean URL
      const cleanPath = to.path
      return navigateTo(cleanPath, { replace: true })
    }
  }
  
  // If user is not authenticated and trying to access a protected route
  if (!authStore.isAuthenticated && !isPublicRoute) {
    // Only add redirect parameter if we're not already on the login page
    // and if the target path is not the root path
    if (to.path !== '/auth/login') {
      // Only add redirect if it's not the home page (to avoid ?redirect=/)
      if (to.path !== '/') {
        return navigateTo({
          path: '/auth/login',
          query: { redirect: to.fullPath }
        })
      } else {
        // For home page, just redirect to login without redirect parameter
        return navigateTo('/auth/login')
      }
    }
  }
  
  // If user is authenticated and trying to access auth pages, redirect to home
  if (authStore.isAuthenticated && isPublicRoute && to.path !== '/') {
    return navigateTo('/')
  }
})

