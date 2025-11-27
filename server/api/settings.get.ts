import { getUserFromEvent } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Return user settings (can be extended with a Settings model later)
  return {
    preferences: {
      theme: 'light', // Default, can be stored in user model or separate settings table
      language: 'en',
      notifications: {
        email: true,
        push: true,
        workoutReminders: true,
        scheduleReminders: true
      },
      privacy: {
        profileVisibility: 'public',
        showEmail: false,
        showActivity: true
      },
      appearance: {
        sidebarCollapsed: false,
        compactMode: false
      }
    },
    account: {
      email: user.email,
      emailVerified: user.emailVerified,
      twoFactorEnabled: false,
      createdAt: user.createdAt
    }
  }
})


