<template>
  <div class="analytics-page">
    <div class="page-header">
      <h1 class="page-title">Analytics</h1>
      <p class="page-subtitle">Track your performance and insights</p>
    </div>

    <div class="analytics-content">
      <div class="stats-grid">
        <el-card class="stat-card" shadow="never">
          <div class="stat-value">1,234</div>
          <div class="stat-label">Total Workouts</div>
        </el-card>
        <el-card class="stat-card" shadow="never">
          <div class="stat-value">45.2h</div>
          <div class="stat-label">Total Time</div>
        </el-card>
        <el-card class="stat-card" shadow="never">
          <div class="stat-value">12,450</div>
          <div class="stat-label">Calories Burned</div>
        </el-card>
        <el-card class="stat-card" shadow="never">
          <div class="stat-value">98%</div>
          <div class="stat-label">Goal Completion</div>
        </el-card>
      </div>

      <el-card class="chart-card" shadow="never">
        <template #header>
          <span class="card-title">Performance Overview</span>
        </template>
        <div class="chart-placeholder">
          <el-empty description="Chart will be displayed here" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.analytics-page {
  width: 100%;
  max-width: 1400px;
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

.analytics-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.stat-card {
  padding: 24px;
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.95rem;
  color: #64748b;
}

.chart-card {
  padding: 24px;
}

.card-title {
  font-weight: 600;
  color: #1e293b;
}

.chart-placeholder {
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

