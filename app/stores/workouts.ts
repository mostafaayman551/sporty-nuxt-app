import { defineStore } from 'pinia'

export interface Workout {
  id: string
  title: string
  type: string
  duration: number
  calories: number
  bpm: number | null
  date: string
  notes: string | null
}

export const useWorkoutsStore = defineStore('workouts', {
  state: () => ({
    workouts: [] as Workout[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    recentWorkouts: (state) => state.workouts.slice(0, 10),
    totalWorkouts: (state) => state.workouts.length,
    totalCalories: (state) => state.workouts.reduce((sum, w) => sum + w.calories, 0),
    totalDuration: (state) => state.workouts.reduce((sum, w) => sum + w.duration, 0)
  },

  actions: {
    async fetchWorkouts(limit = 50) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await useFetch('/api/workouts', {
          params: { limit }
        })
        
        if (error.value) throw error.value
        
        if (data.value) {
          // Create plain objects to avoid serialization issues
          this.workouts = Array.isArray(data.value)
            ? data.value.map((w: any) => ({
                id: w.id,
                title: w.title,
                type: w.type,
                duration: w.duration,
                calories: w.calories,
                bpm: w.bpm,
                date: w.date,
                notes: w.notes
              }))
            : []
        }
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    async addWorkout(workout: Omit<Workout, 'id'>) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await useFetch('/api/workouts', {
          method: 'POST',
          body: workout
        })
        
        if (error.value) throw error.value
        
        if (data.value) {
          // Create plain object to avoid serialization issues
          const workout = {
            id: data.value.id,
            title: data.value.title,
            type: data.value.type,
            duration: data.value.duration,
            calories: data.value.calories,
            bpm: data.value.bpm,
            date: data.value.date,
            notes: data.value.notes
          }
          this.workouts.unshift(workout)
        }
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    }
  }
})
