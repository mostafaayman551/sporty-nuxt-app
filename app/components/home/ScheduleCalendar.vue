<template>
  <div class="calendar-card">
    <div class="calendar-header">
      <h3 class="card-title">Schedule</h3>
      <button class="add-button" aria-label="Add event">
        <el-icon><Plus /></el-icon>
      </button>
    </div>

    <div class="calendar-wrapper">
      <el-calendar v-model="value">
        <template #date-cell="{ data }">
          <div
            class="calendar-cell"
            :class="{
              'is-today': isToday(data.day),
              'is-selected': data.isSelected,
            }"
          >
            <span class="date-number">{{ data.day.split("-")[2] }}</span>
            <div v-if="hasEvent(data.day)" class="event-indicator" />
          </div>
        </template>
      </el-calendar>
    </div>

    <div class="upcoming-section">
      <h4 class="section-title">Upcoming</h4>
      <div class="schedule-list">
        <div class="schedule-item">
          <div class="schedule-time-row">
            <div class="time-badge">09:00 AM</div>
          </div>
          <div class="schedule-details-row">
            <div class="schedule-content">
              <div class="schedule-title">Morning Yoga</div>
              <div class="schedule-meta">45 min • Studio A</div>
            </div>
            <div class="schedule-icon">🧘</div>
          </div>
        </div>

        <div class="schedule-item">
          <div class="schedule-time-row">
            <div class="time-badge">05:30 PM</div>
          </div>
          <div class="schedule-details-row">
            <div class="schedule-content">
              <div class="schedule-title">Cardio Blast</div>
              <div class="schedule-meta">30 min • Gym Floor</div>
            </div>
            <div class="schedule-icon">💪</div>
          </div>
        </div>

        <div class="schedule-item">
          <div class="schedule-time-row">
            <div class="time-badge">07:00 PM</div>
          </div>
          <div class="schedule-details-row">
            <div class="schedule-content">
              <div class="schedule-title">Strength Training</div>
              <div class="schedule-meta">60 min • Weight Room</div>
            </div>
            <div class="schedule-icon">🏋️</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Plus } from "@element-plus/icons-vue";

const value = ref(new Date());

const isToday = (day: string | undefined) => {
  if (!day) return false;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return day === todayStr;
};

const hasEvent = (day: string | undefined) => {
  if (!day) return false;
  return parseInt(day.split("-")[2]) % 3 === 0;
};
</script>

<style scoped>
.calendar-card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  height: 100%;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.025em;
}

.add-button {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
}

.add-button:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
}

.calendar-wrapper {
  background: linear-gradient(to bottom, #f8fafc, #ffffff);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
}

:deep(.el-calendar) {
  background-color: transparent;
  --el-calendar-border: none;
  --el-text-color-primary: #475569;
  --el-fill-color-blank: transparent;
}

:deep(.el-calendar__header) {
  border-bottom: 2px solid #e2e8f0;
  padding: 16px 0 20px;
  margin-bottom: 16px;
}

:deep(.el-calendar__title) {
  color: #1e293b;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.025em;
}

:deep(.el-calendar__button-group) {
  gap: 8px;
}

:deep(.el-calendar__button-group .el-button) {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
}

:deep(.el-calendar__body) {
  padding: 0;
}

:deep(.el-calendar-table) {
  border-spacing: 6px;
}

:deep(.el-calendar-table thead th) {
  color: #64748b;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 10px 0;
  border-bottom: none;
}

:deep(.el-calendar-table td) {
  border: none;
  padding: 3px;
}

:deep(.el-calendar-table .el-calendar-day) {
  min-height: 52px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: all 0.2s ease;
}

:deep(.el-calendar-table .el-calendar-day:hover) {
  background-color: #f1f5f9;
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

:deep(.el-calendar-table td.is-selected .el-calendar-day) {
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.15),
    rgba(16, 185, 129, 0.05)
  );
  border: 2px solid #10b981;
  box-shadow: 0 2px 12px rgba(16, 185, 129, 0.2);
}

.calendar-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  height: 100%;
}

.date-number {
  font-size: 0.875rem;
  color: #475569;
  font-weight: 500;
  transition: all 0.2s ease;
}

.calendar-cell.is-today .date-number {
  color: #10b981;
  font-weight: 700;
  font-size: 1rem;
}

.calendar-cell.is-selected .date-number {
  color: #10b981;
  font-weight: 700;
}

.event-indicator {
  width: 6px;
  height: 6px;
  background: linear-gradient(135deg, #f97316, #fb923c);
  border-radius: 50%;
  margin-top: 4px;
  box-shadow: 0 2px 4px rgba(249, 115, 22, 0.3);
  animation: pulse-indicator 2s ease-in-out infinite;
}

@keyframes pulse-indicator {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.upcoming-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
}

.schedule-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8fafc, #ffffff);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  cursor: pointer;
}

.schedule-item:hover {
  border-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), #ffffff);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
}

.schedule-time-row {
  display: flex;
  align-items: center;
}

.time-badge {
  color: #10b981;
  font-weight: 700;
  font-size: 0.8125rem;
  white-space: nowrap;
  padding: 6px 12px;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.schedule-details-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.schedule-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.schedule-title {
  color: #1e293b;
  font-weight: 600;
  font-size: 0.9375rem;
  line-height: 1.4;
}

.schedule-meta {
  font-size: 0.8125rem;
  color: #64748b;
  line-height: 1.3;
}

.schedule-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.375rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  transition: all 0.3s ease;
}

.schedule-item:hover .schedule-icon {
  transform: scale(1.15) rotate(5deg);
}

@media (max-width: 768px) {
  .calendar-card {
    padding: 24px 20px;
    gap: 20px;
  }

  :deep(.el-calendar-table) {
    border-spacing: 4px;
  }

  :deep(.el-calendar-table .el-calendar-day) {
    min-height: 44px;
  }
}
</style>
