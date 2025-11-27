import { prisma } from '../utils/prisma'
import { getUserFromEvent } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const type = (query.type as string) || 'summary'
  const startDate = query.startDate ? new Date(String(query.startDate)) : new Date()
  startDate.setMonth(startDate.getMonth() - 1) // Default to last month
  startDate.setHours(0, 0, 0, 0)
  const endDate = query.endDate ? new Date(String(query.endDate)) : new Date()
  endDate.setHours(23, 59, 59, 999)

  // Get all data for the period
  const [workouts, metrics, events] = await Promise.all([
    prisma.workout.findMany({
      where: {
        userId: user.id,
        date: { gte: startDate, lte: endDate }
      },
      orderBy: { date: 'desc' }
    }),
    prisma.activityMetric.findMany({
      where: {
        userId: user.id,
        date: { gte: startDate, lte: endDate }
      },
      orderBy: { date: 'desc' }
    }),
    prisma.scheduleEvent.findMany({
      where: {
        userId: user.id,
        startTime: { gte: startDate, lte: endDate }
      },
      orderBy: { startTime: 'desc' }
    })
  ])

  // Generate report based on type
  if (type === 'workouts') {
    const workoutTypes = workouts.reduce((acc: any, w) => {
      const type = w.type || 'other'
      if (!acc[type]) {
        acc[type] = { count: 0, totalCalories: 0, totalDuration: 0, workouts: [] }
      }
      acc[type].count++
      acc[type].totalCalories += w.calories
      acc[type].totalDuration += w.duration
      acc[type].workouts.push(w)
      return acc
    }, {})

    return {
      type: 'workouts',
      period: { startDate, endDate },
      summary: {
        totalWorkouts: workouts.length,
        totalCalories: workouts.reduce((sum, w) => sum + w.calories, 0),
        totalDuration: workouts.reduce((sum, w) => sum + w.duration, 0),
        avgCalories: workouts.length > 0 ? Math.round(workouts.reduce((sum, w) => sum + w.calories, 0) / workouts.length) : 0,
        avgDuration: workouts.length > 0 ? Math.round(workouts.reduce((sum, w) => sum + w.duration, 0) / workouts.length) : 0
      },
      byType: workoutTypes,
      workouts
    }
  }

  if (type === 'activity') {
    return {
      type: 'activity',
      period: { startDate, endDate },
      summary: {
        totalSteps: metrics.reduce((sum, m) => sum + m.steps, 0),
        totalCalories: metrics.reduce((sum, m) => sum + m.calories, 0),
        totalActiveMinutes: metrics.reduce((sum, m) => sum + m.activeMinutes, 0),
        daysTracked: metrics.length,
        avgSteps: metrics.length > 0 ? Math.round(metrics.reduce((sum, m) => sum + m.steps, 0) / metrics.length) : 0,
        avgActiveMinutes: metrics.length > 0 ? Math.round(metrics.reduce((sum, m) => sum + m.activeMinutes, 0) / metrics.length) : 0
      },
      metrics
    }
  }

  if (type === 'schedule') {
    const completed = events.filter(e => e.endTime && new Date(e.endTime) < new Date()).length
    return {
      type: 'schedule',
      period: { startDate, endDate },
      summary: {
        totalEvents: events.length,
        completedEvents: completed,
        pendingEvents: events.length - completed,
        completionRate: events.length > 0 ? Math.round((completed / events.length) * 100) : 0
      },
      events
    }
  }

  // Default: comprehensive summary report
  const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0) + metrics.reduce((sum, m) => sum + m.calories, 0)
  const totalSteps = metrics.reduce((sum, m) => sum + m.steps, 0)
  const completedEvents = events.filter(e => e.endTime && new Date(e.endTime) < new Date()).length

  return {
    type: 'summary',
    period: { startDate, endDate },
    user: {
      name: user.name,
      email: user.email,
      role: user.role
    },
    summary: {
      workouts: {
        total: workouts.length,
        totalCalories: workouts.reduce((sum, w) => sum + w.calories, 0),
        totalDuration: workouts.reduce((sum, w) => sum + w.duration, 0)
      },
      activity: {
        totalSteps,
        totalCalories: metrics.reduce((sum, m) => sum + m.calories, 0),
        totalActiveMinutes: metrics.reduce((sum, m) => sum + m.activeMinutes, 0),
        daysTracked: metrics.length
      },
      schedule: {
        totalEvents: events.length,
        completedEvents,
        completionRate: events.length > 0 ? Math.round((completedEvents / events.length) * 100) : 0
      },
      overall: {
        totalCalories,
        activeDays: new Set([
          ...workouts.map(w => new Date(w.date).toISOString().split('T')[0]),
          ...metrics.map(m => new Date(m.date).toISOString().split('T')[0])
        ]).size
      }
    },
    generatedAt: new Date().toISOString()
  }
})


