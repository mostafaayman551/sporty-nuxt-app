<template>
  <div class="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-semibold text-slate-800">Recent Workouts</h3>
      <a
        href="#"
        class="text-sm text-sporty-green hover:text-emerald-600 transition-colors font-medium"
      >
        View All →
      </a>
    </div>

    <div class="space-y-3">
      <div
        v-for="(workout, index) in workouts"
        :key="index"
        class="workout-card"
      >
        <div class="flex items-center gap-4">
          <div class="workout-icon-wrapper">
            <Icon :name="workout.icon" class="workout-icon" />
          </div>
          <div class="flex-1">
            <div class="workout-title">{{ workout.title }}</div>
            <div class="workout-meta">
              {{ workout.date }} • {{ workout.duration }}
            </div>
          </div>
        </div>
        <div class="workout-stats">
          <div class="stat-calories">{{ workout.calories }} kcal</div>
          <div class="stat-bpm">{{ workout.bpm }} BPM</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const workouts = [
  {
    title: "Morning Run",
    date: "Today, 7:00 AM",
    duration: "45 min",
    calories: 420,
    bpm: 145,
    icon: "material-symbols:directions-run",
  },
  {
    title: "HIIT Training",
    date: "Yesterday, 6:30 PM",
    duration: "30 min",
    calories: 350,
    bpm: 160,
    icon: "material-symbols:fitness-center",
  },
  {
    title: "Cycling",
    date: "Mon, 5:00 PM",
    duration: "60 min",
    calories: 580,
    bpm: 135,
    icon: "material-symbols:directions-bike",
  },
];
</script>

<style scoped>
.workout-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fafc, #ffffff);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  cursor: pointer;
  gap: 16px;
}

.workout-card:hover {
  border-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.04), #ffffff);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.12);
}

.workout-icon-wrapper {
  width: 48px;
  height: 48px;
  min-width: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff, #f1f5f9);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #64748b;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.workout-card:hover .workout-icon-wrapper {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-color: #10b981;
  transform: scale(1.05) rotate(5deg);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.25);
}

.workout-icon {
  font-size: 24px;
}

.workout-title {
  color: #1e293b;
  font-weight: 600;
  font-size: 0.9375rem;
  margin-bottom: 4px;
  line-height: 1.4;
}

.workout-meta {
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.3;
}

.workout-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  min-width: 80px;
}

.stat-calories {
  color: #f97316;
  font-weight: 700;
  font-size: 0.9375rem;
  white-space: nowrap;
}

.stat-bpm {
  font-size: 0.8125rem;
  color: #64748b;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .workout-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .workout-stats {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 12px;
  }
}
</style>
