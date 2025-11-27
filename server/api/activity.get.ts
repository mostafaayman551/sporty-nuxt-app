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

  // Get detailed activity data
  const [workouts, metrics, events] = await Promise.all([
    prisma.workout.findMany({
      where: {
        userId: user.id,
        date: { gte: startDate }
      },
      orderBy: { date: 'desc' }
    }),
    prisma.activityMetric.findMany({
      where: {
        userId: user.id,
        date: { gte: startDate }
      },
      orderBy: { date: 'desc' }
    }),
    prisma.scheduleEvent.findMany({
      where: {
        userId: user.id,
        startTime: { gte: startDate }
      },
      orderBy: { startTime: 'desc' }
    })
  ])

  // Group by date
  const activityByDate: Record<string, any> = {}

  // Add workouts
  workouts.forEach(workout => {
    const date = new Date(workout.date).toISOString().split('T')[0]
    if (!activityByDate[date]) {
      activityByDate[date] = {
        date,
        workouts: [],
        metrics: null,
        events: []
      }
    }
    activityByDate[date].workouts.push({
      id: workout.id,
      title: workout.title,
      type: workout.type,
      duration: workout.duration,
      calories: workout.calories,
      bpm: workout.bpm,
      notes: workout.notes,
      time: new Date(workout.date).toISOString()
    })
  })

  // Add metrics
  metrics.forEach(metric => {
    const date = new Date(metric.date).toISOString().split('T')[0]
    if (!activityByDate[date]) {
      activityByDate[date] = {
        date,
        workouts: [],
        metrics: null,
        events: []
      }
    }
    activityByDate[date].metrics = {
      steps: metric.steps,
      calories: metric.calories,
      activeMinutes: metric.activeMinutes
    }
  })

  // Add events
  events.forEach(event => {
    const date = new Date(event.startTime).toISOString().split('T')[0]
    if (!activityByDate[date]) {
      activityByDate[date] = {
        date,
        workouts: [],
        metrics: null,
        events: []
      }
    }
    activityByDate[date].events.push({
      id: event.id,
      title: event.title,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location
    })
  })

  // Convert to array and sort by date
  const activityData = Object.values(activityByDate).sort((a: any, b: any) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Calculate totals
  const totals = {
    workouts: workouts.length,
    totalCalories: workouts.reduce((sum, w) => sum + w.calories, 0) + metrics.reduce((sum, m) => sum + m.calories, 0),
    totalSteps: metrics.reduce((sum, m) => sum + m.steps, 0),
    totalActiveMinutes: metrics.reduce((sum, m) => sum + m.activeMinutes, 0),
    totalDuration: workouts.reduce((sum, w) => sum + w.duration, 0),
    events: events.length
  }

  return {
    activities: activityData,
    totals,
    period: {
      days,
      startDate: startDate.toISOString(),
      endDate: new Date().toISOString()
    }
  }
})


