<template>
  <div class="schedule-page">
    <div class="page-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">Schedule</h1>
          <p class="page-subtitle">Manage your workout schedule</p>
        </div>
        <el-button type="primary">Add Event</el-button>
      </div>
    </div>

    <div class="schedule-content">
      <el-card class="schedule-card" shadow="never">
        <el-calendar v-model="selectedDate">
          <template #date-cell="{ data }">
            <div class="calendar-day">
              <span class="day-number">{{ data.day.split('-').slice(2).join('-') }}</span>
              <div v-if="hasEvent(data.day)" class="event-indicator"></div>
            </div>
          </template>
        </el-calendar>
      </el-card>

      <el-card class="upcoming-card" shadow="never">
        <template #header>
          <span class="card-title">Upcoming Events</span>
        </template>
        <el-empty description="No upcoming events" />
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'default'
})

const selectedDate = ref(new Date())

const hasEvent = (date: string) => {
  // TODO: Check if date has events
  return false
}
</script>

<style scoped>
.schedule-page {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
}

.schedule-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.schedule-card,
.upcoming-card {
  padding: 24px;
}

.card-title {
  font-weight: 600;
  color: #1e293b;
}

.calendar-day {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.day-number {
  font-size: 0.875rem;
}

.event-indicator {
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  margin-top: 4px;
}

@media (max-width: 768px) {
  .schedule-content {
    grid-template-columns: 1fr;
  }
}
</style>

