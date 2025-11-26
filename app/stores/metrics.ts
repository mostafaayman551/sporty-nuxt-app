import { defineStore } from 'pinia'

export interface ActivityMetric {
  id: string
  date: string
  steps: number
  calories: number
  activeMinutes: number
}

export const useMetricsStore = defineStore('metrics', {
  state: () => ({
    metrics: [] as ActivityMetric[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    todayMetrics: (state) => {
      const today = new Date().toISOString().split('T')[0]
      return state.metrics.find(m => m.date.split('T')[0] === today)
    }
  },

  actions: {
    async fetchMetrics(days = 30) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await useFetch('/api/metrics', {
          params: { days }
        })
        
        if (error.value) throw error.value
        
        if (data.value) {
          // Create plain objects to avoid serialization issues
          this.metrics = Array.isArray(data.value) 
            ? data.value.map((m: any) => ({
                id: m.id,
                date: m.date,
                steps: m.steps,
                calories: m.calories,
                activeMinutes: m.activeMinutes
              }))
            : []
        }
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    async updateTodayMetrics(updates: Partial<ActivityMetric>) {
      const today = new Date().toISOString().split('T')[0]
      
      try {
        const { data, error } = await useFetch('/api/metrics', {
          method: 'POST',
          body: {
            ...updates,
            date: today
          }
        })
        
        if (error.value) throw error.value
        
        if (data.value) {
          // Create plain object to avoid serialization issues
          const metric = {
            id: data.value.id,
            date: data.value.date,
            steps: data.value.steps,
            calories: data.value.calories,
            activeMinutes: data.value.activeMinutes
          }
          const index = this.metrics.findIndex(m => m.id === metric.id)
          if (index !== -1) {
            this.metrics[index] = metric
          } else {
            this.metrics.unshift(metric)
          }
        }
      } catch (e: any) {
        console.error(e)
      }
    }
  }
})
