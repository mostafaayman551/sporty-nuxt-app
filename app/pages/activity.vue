<template>
  <div class="activity-page">
    <div class="page-header">
      <h1 class="page-title">Activity</h1>
      <p class="page-subtitle">View your recent activity and workouts</p>
    </div>

    <div class="activity-content">
      <el-timeline>
        <el-timeline-item
          v-for="activity in activities"
          :key="activity.id"
          :timestamp="activity.time"
          placement="top"
        >
          <el-card>
            <h4>{{ activity.title }}</h4>
            <p>{{ activity.description }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'default'
})

const activities = ref([
  {
    id: 1,
    title: 'Morning Run',
    description: 'Completed 5.2 km in 28 minutes',
    time: '2 hours ago'
  },
  {
    id: 2,
    title: 'HIIT Workout',
    description: 'Completed 30-minute high-intensity interval training',
    time: 'Yesterday'
  },
  {
    id: 3,
    title: 'Cycling Session',
    description: 'Rode 15 km in 45 minutes',
    time: '2 days ago'
  }
])
</script>

<style scoped>
.activity-page {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
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

.activity-content {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>

