<template>
  <div class="home-hero">
    <div class="hero-content">
      <div class="hero-header">
        <h1 class="app-title">Sporty</h1>
        <p class="app-tagline">The All-in-One Dashboard for Business Leaders</p>
        <p class="app-subtitle">
          Track metrics, analyze performance, and make data-driven decisions
          with confidence
        </p>
      </div>

      <div class="hero-actions">
        <el-button type="primary" size="large" class="cta-button">
          Get Started
          <el-icon class="ml-2"><ArrowRight /></el-icon>
        </el-button>
        <el-button
          size="large"
          class="secondary-button"
          @click="showVideoModal = true"
        >
          Watch Demo
          <el-icon class="ml-2"><VideoPlay /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- Video Modal -->
    <UiVideoModal
      v-model="showVideoModal"
      title="Sporty Platform Demo"
      video-url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    />

    <div class="stats-section">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" class="stat-col">
          <div class="statistic-card">
            <el-statistic :value="98500">
              <template #title>
                <div class="stat-title-wrapper">
                  Daily Active Users
                  <el-tooltip
                    effect="dark"
                    content="Number of users who logged into the product in one day"
                    placement="top"
                  >
                    <el-icon class="info-icon" :size="14">
                      <Warning />
                    </el-icon>
                  </el-tooltip>
                </div>
              </template>
            </el-statistic>
            <div class="statistic-footer">
              <div class="footer-item">
                <span class="footer-label">than yesterday</span>
                <span class="trend-up">
                  24%
                  <el-icon><CaretTop /></el-icon>
                </span>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" class="stat-col">
          <div class="statistic-card">
            <el-statistic :value="693700">
              <template #title>
                <div class="stat-title-wrapper">
                  Monthly Active Users
                  <el-tooltip
                    effect="dark"
                    content="Number of users who logged into the product in one month"
                    placement="top"
                  >
                    <el-icon class="info-icon" :size="14">
                      <Warning />
                    </el-icon>
                  </el-tooltip>
                </div>
              </template>
            </el-statistic>
            <div class="statistic-footer">
              <div class="footer-item">
                <span class="footer-label">month on month</span>
                <span class="trend-down">
                  12%
                  <el-icon><CaretBottom /></el-icon>
                </span>
              </div>
            </div>
          </div>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" class="stat-col">
          <div class="statistic-card">
            <el-statistic :value="72000">
              <template #title>
                <div class="stat-title-wrapper">New Transactions Today</div>
              </template>
            </el-statistic>
            <div class="statistic-footer">
              <div class="footer-item">
                <span class="footer-label">than yesterday</span>
                <span class="trend-up">
                  16%
                  <el-icon><CaretTop /></el-icon>
                </span>
              </div>
              <div class="footer-action">
                <el-icon :size="16">
                  <ArrowRight />
                </el-icon>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  ArrowRight,
  CaretBottom,
  CaretTop,
  Warning,
  VideoPlay,
} from "@element-plus/icons-vue";

const showVideoModal = ref(false);
</script>

<style scoped>
.home-hero {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px 0 60px;
  position: relative;
}

.hero-content {
  margin-bottom: 64px;
}

.hero-header {
  max-width: 800px;
  margin-bottom: 40px;
}

.app-title {
  font-size: 4rem;
  font-weight: 900;
  background: linear-gradient(135deg, #1e293b 0%, #10b981 50%, #0ea5e9 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 16px;
  letter-spacing: -0.05em;
  line-height: 1;
  animation: fadeInUp 0.8s ease-out;
}

.app-tagline {
  font-size: 1.75rem;
  color: #1e293b;
  margin: 0 0 16px;
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.3;
  animation: fadeInUp 0.8s ease-out 0.1s backwards;
}

.app-subtitle {
  font-size: 1.125rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
  line-height: 1.6;
  max-width: 600px;
  animation: fadeInUp 0.8s ease-out 0.2s backwards;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease-out 0.3s backwards;
}

.cta-button {
  height: 52px;
  padding: 0 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(64, 158, 255, 0.3);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
}

.secondary-button {
  height: 52px;
  padding: 0 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  background: white;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.secondary-button:hover {
  border-color: #10b981;
  color: #10b981;
  transform: translateY(-3px);
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.2);
}

.ml-2 {
  margin-left: 8px;
}

.stats-section {
  animation: fadeInUp 0.8s ease-out 0.4s backwards;
}

.stat-col {
  margin-bottom: 20px;
}

.el-statistic {
  --el-statistic-content-font-size: 32px;
  --el-statistic-content-color: #1e293b;
  --el-statistic-title-color: #64748b;
}

.statistic-card {
  height: 100%;
  padding: 28px 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.statistic-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #10b981, #0ea5e9, #f97316);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.statistic-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08), 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.statistic-card:hover::before {
  opacity: 1;
}

.stat-title-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-icon {
  color: #94a3b8;
  cursor: help;
  transition: color 0.2s ease;
}

.info-icon:hover {
  color: #64748b;
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-label {
  font-size: 0.8125rem;
  color: #94a3b8;
  font-weight: 500;
}

.trend-up {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 700;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
}

.trend-down {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 700;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
}

.footer-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.footer-action:hover {
  background: linear-gradient(135deg, #10b981, #0ea5e9);
  color: white;
  transform: translateX(4px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .app-title {
    font-size: 2.5rem;
  }

  .app-tagline {
    font-size: 1.25rem;
  }

  .app-subtitle {
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .cta-button,
  .secondary-button {
    width: 100%;
  }
}
</style>
