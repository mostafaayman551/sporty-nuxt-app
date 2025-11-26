<template>
  <div class="settings-page">
    <div class="settings-container">
      <div class="settings-header">
        <h1 class="page-title">Settings</h1>
        <p class="page-subtitle">Manage your account settings and preferences</p>
      </div>

      <div class="settings-content">
        <div class="settings-sidebar">
          <el-menu
            :default-active="activeTab"
            class="settings-menu"
            @select="handleMenuSelect"
          >
            <el-menu-item index="preferences">
              <el-icon><Tools /></el-icon>
              <span>Preferences</span>
            </el-menu-item>
            <el-menu-item index="account">
              <el-icon><User /></el-icon>
              <span>Account</span>
            </el-menu-item>
            <el-menu-item index="privacy">
              <el-icon><Lock /></el-icon>
              <span>Privacy & Security</span>
            </el-menu-item>
            <el-menu-item index="notifications">
              <el-icon><Bell /></el-icon>
              <span>Notifications</span>
            </el-menu-item>
            <el-menu-item index="appearance">
              <el-icon><Sunny /></el-icon>
              <span>Appearance</span>
            </el-menu-item>
          </el-menu>
        </div>

        <div class="settings-main">
          <NuxtPage />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Tools, User, Lock, Bell, Sunny } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const activeTab = computed(() => {
  const path = route.path
  if (path === '/settings' || path === '/settings/') {
    return 'preferences'
  }
  return path.split('/').pop() || 'preferences'
})

const handleMenuSelect = (key: string) => {
  router.push(`/settings/${key}`)
}

// Redirect to preferences if on base settings route
watch(() => route.path, (path) => {
  if (path === '/settings' || path === '/settings/') {
    router.replace('/settings/preferences')
  }
}, { immediate: true })
</script>

<style scoped>
.settings-page {
  width: 100%;
  min-height: 100%;
  padding: 32px;
  background: #f8fafc;
}

.settings-container {
  max-width: 1400px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.settings-header {
  padding: 32px 40px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  letter-spacing: -0.025em;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
}

.settings-content {
  display: flex;
  min-height: 600px;
}

.settings-sidebar {
  width: 260px;
  border-right: 1px solid #e2e8f0;
  background: #f8fafc;
}

.settings-menu {
  border: none;
  background: transparent;
  padding: 16px 0;
}

:deep(.el-menu-item) {
  height: 48px;
  line-height: 48px;
  margin: 4px 12px;
  border-radius: 10px;
  color: #64748b;
  font-weight: 500;
  transition: all 0.2s ease;
}

:deep(.el-menu-item:hover) {
  background: #f1f5f9;
  color: #10b981;
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-weight: 600;
}

:deep(.el-menu-item .el-icon) {
  margin-right: 12px;
  font-size: 18px;
}

.settings-main {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .settings-page {
    padding: 16px;
  }

  .settings-content {
    flex-direction: column;
  }

  .settings-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }

  .settings-menu {
    display: flex;
    overflow-x: auto;
    padding: 12px;
  }

  :deep(.el-menu-item) {
    white-space: nowrap;
    margin: 0 8px;
  }

  .settings-main {
    padding: 24px;
  }
}
</style>

