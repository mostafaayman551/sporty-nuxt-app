import { defineStore } from 'pinia'

export interface ScheduleEvent {
  id: string
  title: string
  description: string | null
  startTime: string
  endTime: string | null
  location: string | null
}

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    events: [] as ScheduleEvent[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    upcomingEvents: (state) => {
      const now = new Date()
      return state.events
        .filter(e => new Date(e.startTime) >= now)
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        .slice(0, 5)
    }
  },

  actions: {
    async fetchEvents(startDate?: Date, endDate?: Date) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await useFetch('/api/schedule', {
          params: {
            startDate: startDate?.toISOString(),
            endDate: endDate?.toISOString()
          }
        })
        
        if (error.value) throw error.value
        
        if (data.value) {
          // Create plain objects to avoid serialization issues
          this.events = Array.isArray(data.value)
            ? data.value.map((e: any) => ({
                id: e.id,
                title: e.title,
                description: e.description,
                startTime: e.startTime,
                endTime: e.endTime,
                location: e.location
              }))
            : []
        }
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    },

    async addEvent(event: Omit<ScheduleEvent, 'id'>) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await useFetch('/api/schedule', {
          method: 'POST',
          body: event
        })
        
        if (error.value) throw error.value
        
        if (data.value) {
          // Create plain object to avoid serialization issues
          const event = {
            id: data.value.id,
            title: data.value.title,
            description: data.value.description,
            startTime: data.value.startTime,
            endTime: data.value.endTime,
            location: data.value.location
          }
          this.events.push(event)
          this.events.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
        }
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.loading = false
      }
    }
  }
})
