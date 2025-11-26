<template>
  <div class="sidebar-container" :class="{ collapsed: isCollapse }">
    <div class="sidebar-header">
      <div class="toggle-button" @click="toggleCollapse">
        <el-icon><Menu /></el-icon>
      </div>
    </div>

    <nav class="sidebar-nav">
      <el-menu
        default-active="1"
        class="sidebar-menu"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <el-menu-item index="1" class="menu-item" @click="navigateTo('/')">
          <el-icon><House /></el-icon>
          <template #title>
            <span class="menu-text">Dashboard</span>
          </template>
        </el-menu-item>

        <el-menu-item index="2" class="menu-item" @click="navigateTo('/analytics')">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>
            <span class="menu-text">Analytics</span>
            <span class="menu-badge">New</span>
          </template>
        </el-menu-item>

        <el-menu-item index="3" class="menu-item" @click="navigateTo('/activity')">
          <el-icon><Timer /></el-icon>
          <template #title>
            <span class="menu-text">Activity</span>
          </template>
        </el-menu-item>

        <el-menu-item index="4" class="menu-item" @click="navigateTo('/schedule')">
          <el-icon><Calendar /></el-icon>
          <template #title>
            <span class="menu-text">Schedule</span>
          </template>
        </el-menu-item>

        <el-menu-item index="5" class="menu-item" @click="navigateTo('/reports')">
          <el-icon><TrendCharts /></el-icon>
          <template #title>
            <span class="menu-text">Reports</span>
          </template>
        </el-menu-item>

        <div class="menu-divider"></div>

        <el-menu-item index="6" class="menu-item" @click="navigateTo('/team')">
          <el-icon><User /></el-icon>
          <template #title>
            <span class="menu-text">Team</span>
          </template>
        </el-menu-item>

        <el-menu-item index="7" class="menu-item" @click="navigateTo('/settings')">
          <el-icon><Setting /></el-icon>
          <template #title>
            <span class="menu-text">Settings</span>
          </template>
        </el-menu-item>
      </el-menu>
    </nav>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  House,
  Timer,
  Calendar,
  Setting,
  Menu,
  DataAnalysis,
  TrendCharts,
  User,
} from "@element-plus/icons-vue";

const isCollapse = ref(false);

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
};
</script>

<style scoped>
.sidebar-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 260px;
  position: relative;
}

.sidebar-container.collapsed {
  width: 72px;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.toggle-button {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 10px;
  color: #64748b;
  transition: all 0.2s ease;
  user-select: none;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.toggle-button:hover {
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  color: #10b981;
  border-color: #cbd5e1;
}

.toggle-button:active {
  transform: scale(0.95);
}

.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-menu {
  border: none;
  background: transparent;
}

.menu-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 16px 8px;
}

:deep(.el-menu-item) {
  height: 44px;
  line-height: 44px;
  margin-bottom: 4px;
  border-radius: 10px;
  transition: all 0.2s ease;
  color: #64748b;
  font-weight: 500;
}

:deep(.el-menu-item:hover) {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9) !important;
  color: #10b981;
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.1),
    rgba(14, 165, 233, 0.05)
  ) !important;
  color: #10b981;
  font-weight: 600;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

:deep(.el-menu-item .el-icon) {
  font-size: 20px;
  margin-right: 12px;
}

:deep(.sidebar-container.collapsed .el-menu-item .el-icon) {
  margin-right: 0;
}

.menu-text {
  font-size: 0.9375rem;
}

.menu-badge {
  background: linear-gradient(135deg, #10b981, #0ea5e9);
  color: white;
  font-size: 0.5rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: auto;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.2;
}

/* Scrollbar styling */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 3px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

@media (max-width: 768px) {
  .sidebar-container {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1000;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }
}
</style>
