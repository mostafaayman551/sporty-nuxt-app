import { prisma } from '../utils/prisma'
import { getUserFromEvent } from '../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getUserFromEvent(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const days = Number(query.days) || 30
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)

  // Get workouts data
  const workouts = await prisma.workout.findMany({
    where: {
      userId: user.id,
      date: { gte: startDate }
    }
  })

  // Get activity metrics
  const metrics = await prisma.activityMetric.findMany({
    where: {
      userId: user.id,
      date: { gte: startDate }
    }
  })

  // Get schedule events
  const events = await prisma.scheduleEvent.findMany({
    where: {
      userId: user.id,
      startTime: { gte: startDate }
    }
  })

  // Calculate analytics
  const totalWorkouts = workouts.length
  const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0)
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0)
  const avgCalories = totalWorkouts > 0 ? Math.round(totalCalories / totalWorkouts) : 0
  const avgDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0

  // Workout types distribution
  const workoutTypes = workouts.reduce((acc: any, w) => {
    const type = w.type || 'other'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {})

  // Activity metrics totals
  const totalSteps = metrics.reduce((sum, m) => sum + m.steps, 0)
  const totalActiveMinutes = metrics.reduce((sum, m) => sum + m.activeMinutes, 0)
  const avgSteps = metrics.length > 0 ? Math.round(totalSteps / metrics.length) : 0
  const avgActiveMinutes = metrics.length > 0 ? Math.round(totalActiveMinutes / metrics.length) : 0

  // Schedule stats
  const totalEvents = events.length
  const completedEvents = events.filter(e => e.endTime && new Date(e.endTime) < new Date()).length

  // Weekly breakdown
  const weeklyData = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)
    const nextDate = new Date(date)
    nextDate.setDate(nextDate.getDate() + 1)

    const weekWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.date)
      return workoutDate >= date && workoutDate < nextDate
    })
    const weekMetrics = metrics.filter(m => {
      const metricDate = new Date(m.date)
      return metricDate >= date && metricDate < nextDate
    })

    weeklyData.push({
      date: date.toISOString().split('T')[0],
      workouts: weekWorkouts.length,
      calories: weekWorkouts.reduce((sum, w) => sum + w.calories, 0),
      steps: weekMetrics.reduce((sum, m) => sum + m.steps, 0),
      activeMinutes: weekMetrics.reduce((sum, m) => sum + m.activeMinutes, 0)
    })
  }

  return {
    summary: {
      workouts: {
        total: totalWorkouts,
        totalCalories,
        totalDuration,
        avgCalories,
        avgDuration,
        types: workoutTypes
      },
      activity: {
        totalSteps,
        totalActiveMinutes,
        avgSteps,
        avgActiveMinutes,
        daysTracked: metrics.length
      },
      schedule: {
        totalEvents,
        completedEvents,
        completionRate: totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0
      }
    },
    weekly: weeklyData,
    period: {
      days,
      startDate: startDate.toISOString(),
      endDate: new Date().toISOString()
    }
  }
})


