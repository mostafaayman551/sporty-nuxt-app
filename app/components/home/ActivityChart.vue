<template>
  <div class="activity-chart-card">
    <h3 class="chart-title">Today's Activity</h3>

    <div class="chart-wrapper">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>

    <div class="chart-legend">
      <div class="legend-item">
        <span class="legend-dot legend-dot-steps" />
        <span class="legend-label">Steps</span>
        <span class="legend-value">8,500</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot legend-dot-calories" />
        <span class="legend-label">Calories</span>
        <span class="legend-value">520 kcal</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot legend-dot-active" />
        <span class="legend-label">Active</span>
        <span class="legend-value">45 min</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

const chartData = {
  labels: ["Steps", "Calories", "Active Time"],
  datasets: [
    {
      backgroundColor: ["#10b981", "#f97316", "#0ea5e9"],
      data: [65, 20, 15],
      borderWidth: 0,
      hoverOffset: 8,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "rgba(30, 41, 59, 0.95)",
      padding: 12,
      cornerRadius: 8,
      titleFont: {
        size: 14,
        weight: 600,
      },
      bodyFont: {
        size: 13,
      },
      displayColors: true,
      boxWidth: 12,
      boxHeight: 12,
      boxPadding: 6,
    },
  },
  cutout: "72%",
  animation: {
    animateRotate: true,
    animateScale: true,
  },
};
</script>

<style scoped>
.activity-chart-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  height: 100%;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px;
  letter-spacing: -0.025em;
}

.chart-wrapper {
  flex: 1;
  position: relative;
  min-height: 240px;
  max-height: 280px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: linear-gradient(135deg, #f8fafc, transparent);
  transition: all 0.2s ease;
}

.legend-item:hover {
  background: linear-gradient(135deg, #f1f5f9, #f8fafc);
  transform: translateX(4px);
}

.legend-dot {
  width: 12px;
  height: 12px;
  min-width: 12px;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

.legend-dot-steps {
  background: linear-gradient(135deg, #10b981, #059669);
}

.legend-dot-calories {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.legend-dot-active {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
}

.legend-label {
  flex: 1;
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.legend-value {
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 700;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .activity-chart-card {
    padding: 20px;
  }

  .chart-wrapper {
    min-height: 200px;
    max-height: 240px;
  }
}
</style>
