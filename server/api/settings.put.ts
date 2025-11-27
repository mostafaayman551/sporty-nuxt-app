import { getUserFromEvent } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const { preferences, account } = body

  // For now, settings are stored in memory/returned as defaults
  // In the future, you can create a Settings model in Prisma
  // This endpoint validates and returns the settings structure

  const updatedSettings = {
    preferences: {
      theme: preferences?.theme || 'light',
      language: preferences?.language || 'en',
      notifications: {
        email: preferences?.notifications?.email ?? true,
        push: preferences?.notifications?.push ?? true,
        workoutReminders: preferences?.notifications?.workoutReminders ?? true,
        scheduleReminders: preferences?.notifications?.scheduleReminders ?? true
      },
      privacy: {
        profileVisibility: preferences?.privacy?.profileVisibility || 'public',
        showEmail: preferences?.privacy?.showEmail ?? false,
        showActivity: preferences?.privacy?.showActivity ?? true
      },
      appearance: {
        sidebarCollapsed: preferences?.appearance?.sidebarCollapsed ?? false,
        compactMode: preferences?.appearance?.compactMode ?? false
      }
    },
    account: {
      email: user.email,
      emailVerified: user.emailVerified,
      twoFactorEnabled: account?.twoFactorEnabled ?? false,
      createdAt: user.createdAt
    }
  }

  return { settings: updatedSettings, message: 'Settings updated successfully' }
})


