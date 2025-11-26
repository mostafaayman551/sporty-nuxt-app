<template>
  <div class="notifications-page">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Notifications</h1>
        <div class="header-actions">
          <el-button type="primary" plain @click="handleMarkAllRead" :disabled="unreadCount === 0">
            Mark all as read
          </el-button>
          <el-button @click="handleRefresh" :loading="loading">
            Refresh
          </el-button>
        </div>
      </div>
      <p class="page-subtitle">
        You have <strong>{{ unreadCount }}</strong> unread notification{{ unreadCount !== 1 ? 's' : '' }}
      </p>
    </div>

    <div class="notifications-container">
      <el-tabs v-model="activeTab" class="notifications-tabs">
        <el-tab-pane label="All" name="all">
          <div class="notifications-list">
            <div
              v-for="notification in filteredNotifications"
              :key="notification.id"
              class="notification-card"
              :class="{ unread: !notification.read }"
              @click="handleNotificationClick(notification)"
            >
              <div class="notification-icon" :class="notification.type">
                <el-icon v-if="notification.type === 'success'"><Check /></el-icon>
                <el-icon v-else-if="notification.type === 'info'"><InfoFilled /></el-icon>
                <el-icon v-else-if="notification.type === 'warning'"><Warning /></el-icon>
                <el-icon v-else><Bell /></el-icon>
              </div>
              <div class="notification-content">
                <div class="notification-header">
                  <h3 class="notification-title">{{ notification.title }}</h3>
                  <div class="notification-actions">
                    <el-button
                      v-if="!notification.read"
                      text
                      type="primary"
                      size="small"
                      @click.stop="handleMarkRead(notification.id)"
                    >
                      Mark as read
                    </el-button>
                    <el-button
                      text
                      type="danger"
                      size="small"
                      @click.stop="handleDelete(notification.id)"
                    >
                      Delete
                    </el-button>
                  </div>
                </div>
                <p class="notification-message">{{ notification.message }}</p>
                <div class="notification-footer">
                  <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
                  <el-tag v-if="notification.category" size="small" type="info">
                    {{ notification.category }}
                  </el-tag>
                </div>
              </div>
            </div>

            <el-empty
              v-if="filteredNotifications.length === 0"
              description="No notifications found"
            />
          </div>
        </el-tab-pane>

        <el-tab-pane label="Unread" name="unread">
          <div class="notifications-list">
            <div
              v-for="notification in unreadNotifications"
              :key="notification.id"
              class="notification-card unread"
              @click="handleNotificationClick(notification)"
            >
              <div class="notification-icon" :class="notification.type">
                <el-icon v-if="notification.type === 'success'"><Check /></el-icon>
                <el-icon v-else-if="notification.type === 'info'"><InfoFilled /></el-icon>
                <el-icon v-else-if="notification.type === 'warning'"><Warning /></el-icon>
                <el-icon v-else><Bell /></el-icon>
              </div>
              <div class="notification-content">
                <div class="notification-header">
                  <h3 class="notification-title">{{ notification.title }}</h3>
                  <el-button
                    text
                    type="primary"
                    size="small"
                    @click.stop="handleMarkRead(notification.id)"
                  >
                    Mark as read
                  </el-button>
                </div>
                <p class="notification-message">{{ notification.message }}</p>
                <div class="notification-footer">
                  <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
                  <el-tag v-if="notification.category" size="small" type="info">
                    {{ notification.category }}
                  </el-tag>
                </div>
              </div>
            </div>

            <el-empty
              v-if="unreadNotifications.length === 0"
              description="No unread notifications"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, InfoFilled, Warning, Bell } from '@element-plus/icons-vue'

definePageMeta({
  layout: 'default'
})

const loading = ref(false)
const activeTab = ref('all')

interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'info' | 'warning' | 'default'
  read: boolean
  createdAt: Date
  category?: string
}

const notifications = ref<Notification[]>([
  {
    id: '1',
    title: 'Workout completed!',
    message: 'Great job on your morning run. You completed 5.2 km in 28 minutes.',
    type: 'success',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    category: 'Workout'
  },
  {
    id: '2',
    title: 'Weekly report ready',
    message: 'Your analytics summary for this week is now available. Check out your progress!',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    category: 'Analytics'
  },
  {
    id: '3',
    title: 'Goal achieved!',
    message: "Congratulations! You've reached your daily step goal of 10,000 steps.",
    type: 'warning',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    category: 'Achievement'
  },
  {
    id: '4',
    title: 'New workout scheduled',
    message: 'You have a HIIT workout scheduled for tomorrow at 7:00 AM.',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    category: 'Schedule'
  },
  {
    id: '5',
    title: 'Team challenge started',
    message: 'A new team challenge has started. Join now to compete with your colleagues!',
    type: 'default',
    read: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    category: 'Social'
  }
])

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const filteredNotifications = computed(() => {
  if (activeTab.value === 'unread') {
    return notifications.value.filter(n => !n.read)
  }
  return notifications.value
})

const unreadNotifications = computed(() => {
  return notifications.value.filter(n => !n.read)
})

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

const handleNotificationClick = (notification: Notification) => {
  if (!notification.read) {
    handleMarkRead(notification.id)
  }
  // TODO: Navigate to notification detail or related page
  ElMessage.info(`Opening: ${notification.title}`)
}

const handleMarkRead = (id: string) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
    ElMessage.success('Marked as read')
  }
}

const handleMarkAllRead = async () => {
  try {
    loading.value = true
    // TODO: Call API to mark all as read
    await new Promise(resolve => setTimeout(resolve, 500))
    notifications.value.forEach(n => { n.read = true })
    ElMessage.success('All notifications marked as read')
  } catch (error) {
    ElMessage.error('Failed to mark all as read')
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this notification?',
      'Delete Notification',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )
    // TODO: Call API to delete notification
    notifications.value = notifications.value.filter(n => n.id !== id)
    ElMessage.success('Notification deleted')
  } catch {
    // User cancelled
  }
}

const handleRefresh = async () => {
  loading.value = true
  try {
    // TODO: Fetch notifications from API
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('Notifications refreshed')
  } catch (error) {
    ElMessage.error('Failed to refresh notifications')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.notifications-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.025em;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.notifications-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.notifications-tabs {
  padding: 0;
}

:deep(.el-tabs__header) {
  margin: 0;
  padding: 0 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

:deep(.el-tabs__content) {
  padding: 0;
}

.notifications-list {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.notification-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.notification-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.notification-card.unread {
  background: #f0fdf4;
  border-color: #86efac;
  border-left: 4px solid #10b981;
}

.notification-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 24px;
}

.notification-icon.success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.notification-icon.info {
  background: rgba(14, 165, 233, 0.1);
  color: #0ea5e9;
}

.notification-icon.warning {
  background: rgba(249, 115, 22, 0.1);
  color: #f97316;
}

.notification-icon.default {
  background: rgba(100, 116, 139, 0.1);
  color: #64748b;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 16px;
}

.notification-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  flex: 1;
}

.notification-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.notification-message {
  font-size: 0.9375rem;
  color: #64748b;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.notification-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.notification-time {
  font-size: 0.8125rem;
  color: #94a3b8;
}

/* Scrollbar styling */
.notifications-list::-webkit-scrollbar {
  width: 6px;
}

.notifications-list::-webkit-scrollbar-track {
  background: transparent;
}

.notifications-list::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 3px;
}

.notifications-list::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    flex: 1;
  }

  .notification-card {
    padding: 16px;
  }

  .notification-header {
    flex-direction: column;
    gap: 8px;
  }

  .notification-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>

