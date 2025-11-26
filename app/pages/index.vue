<template>
  <div class="home-page">
    <div class="hero-wrapper">
      <HomeHero />
    </div>

    <div class="dashboard-container">
      <div class="dashboard-grid">
        <div class="chart-section" v-motion-slide-visible-bottom :delay="200">
          <HomeActivityChart />
        </div>

        <div
          class="calendar-section"
          v-motion-slide-visible-bottom
          :delay="400"
        >
          <HomeScheduleCalendar />
        </div>

        <div
          class="workouts-section"
          v-motion-slide-visible-bottom
          :delay="600"
        >
          <HomeRecentWorkouts />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Global middleware handles authentication
</script>

<style scoped>
.home-page {
  width: 100%;
  min-height: 100%;
  padding-bottom: 80px;
}

.hero-wrapper {
  margin-bottom: 60px;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  align-items: start;
}

.chart-section,
.calendar-section,
.workouts-section {
  min-height: 480px;
  display: flex;
}

.chart-section {
  grid-column: span 1;
}

.calendar-section {
  grid-column: span 1;
}

.workouts-section {
  grid-column: span 1;
}

@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 28px;
  }

  .workouts-section {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 0 16px;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .chart-section,
  .calendar-section,
  .workouts-section {
    grid-column: span 1;
  }

  .hero-wrapper {
    margin-bottom: 40px;
  }
}
</style>
