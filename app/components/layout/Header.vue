<template>
  <div class="app-header">
    <div class="header-left">
      <div class="logo-area">
        <span class="logo-text">Sporty</span>
        <span class="logo-badge">Pro</span>
      </div>
    </div>

    <div class="header-center">
      <div class="search-bar" @click="openSearch">
        <el-icon class="search-icon"><Search /></el-icon>
        <input
          ref="searchInput"
          type="text"
          placeholder="Search for workouts, metrics, analytics..."
          class="search-input"
          @keydown="handleSearchKeydown"
        />
        <kbd class="search-shortcut">Ctrl+K</kbd>
      </div>
    </div>

    <div class="header-right">
      <div class="header-actions">
        <!-- Notifications Dropdown -->
        <el-dropdown trigger="click" @command="handleNotificationClick" @visible-change="fetchNotifications">
          <button
            class="icon-button notification-btn"
            aria-label="Notifications"
          >
            <el-icon><Bell /></el-icon>
            <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
          </button>
          <template #dropdown>
            <el-dropdown-menu class="notifications-dropdown">
              <div class="dropdown-header">
                <h4>Notifications</h4>
                <button v-if="unreadCount > 0" class="mark-read-btn" @click="markAllAsRead">Mark all as read</button>
              </div>
              <div v-if="loadingNotifications" class="loading-notifications">
                <el-icon class="is-loading"><Loading /></el-icon>
                <span>Loading...</span>
                    </div>
              <template v-else-if="notifications.length > 0">
                <el-dropdown-item 
                  v-for="notification in notifications" 
                  :key="notification.id"
                  :command="`notification-${notification.id}`"
                >
                  <div class="notification-item" :class="{ unread: !notification.read }">
                    <div class="notification-icon" :class="notification.type">
                      <el-icon v-if="notification.type === 'success'"><Check /></el-icon>
                      <el-icon v-else-if="notification.type === 'info'"><InfoFilled /></el-icon>
                      <el-icon v-else-if="notification.type === 'warning'"><Warning /></el-icon>
                      <el-icon v-else><Bell /></el-icon>
                    </div>
                  <div class="notification-content">
                      <div class="notification-title">{{ notification.title }}</div>
                      <div class="notification-text">{{ notification.message }}</div>
                      <div class="notification-time">{{ formatTime(notification.createdAt) }}</div>
                    </div>
                  </div>
                </el-dropdown-item>
              </template>
              <div v-else class="no-notifications">
                <p>No notifications</p>
                </div>
              <div class="dropdown-footer">
                <NuxtLink to="/notifications" class="view-all-btn">
                  View all notifications
                </NuxtLink>
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <!-- Settings Dropdown -->
        <el-dropdown trigger="click" @command="handleSettingsCommand">
          <button class="icon-button" aria-label="Settings">
            <el-icon><Setting /></el-icon>
          </button>
          <template #dropdown>
            <el-dropdown-menu class="settings-dropdown">
              <div class="dropdown-header">
                <h4>Settings</h4>
              </div>
              <el-dropdown-item command="preferences">
                <el-icon><Tools /></el-icon>
                <span>Preferences</span>
              </el-dropdown-item>
              <el-dropdown-item command="account">
                <el-icon><User /></el-icon>
                <span>Account Settings</span>
              </el-dropdown-item>
              <el-dropdown-item command="privacy">
                <el-icon><Lock /></el-icon>
                <span>Privacy & Security</span>
              </el-dropdown-item>
              <el-dropdown-item command="notifications">
                <el-icon><Bell /></el-icon>
                <span>Notifications</span>
              </el-dropdown-item>
              <el-dropdown-item command="appearance">
                <el-icon><Sunny /></el-icon>
                <span>Appearance</span>
              </el-dropdown-item>
              <div class="dropdown-footer">
                <NuxtLink to="/settings" class="view-all-settings-btn">
                  <span>Open All Settings</span>
                  <el-icon><ArrowRight /></el-icon>
                </NuxtLink>
              </div>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <div class="divider"></div>

        <!-- User Profile Dropdown -->
        <el-dropdown trigger="click" @command="handleUserCommand">
          <div class="user-profile">
            <div class="avatar" v-if="userAvatar">
              <img :src="userAvatar" :alt="userName" />
            </div>
            <div class="avatar" v-else>
              <span>{{ userInitials }}</span>
            </div>
            <div class="user-info">
              <div class="user-name">{{ userName }}</div>
              <div class="user-role">{{ userRole }}</div>
            </div>
            <el-icon class="dropdown-arrow"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu class="user-dropdown">
              <div class="dropdown-user-header">
                <div class="avatar large" v-if="userAvatar">
                  <img :src="userAvatar" :alt="userName" />
                </div>
                <div class="avatar large" v-else>
                  <span>{{ userInitials }}</span>
                </div>
                <div class="user-details">
                  <div class="user-name-large">{{ userName }}</div>
                  <div class="user-email">{{ userEmail }}</div>
                </div>
              </div>
              <el-dropdown-item command="profile" divided>
                <el-icon><User /></el-icon>
                <span>My Profile</span>
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon>
                <span>Settings</span>
              </el-dropdown-item>
              <el-dropdown-item command="billing">
                <el-icon><CreditCard /></el-icon>
                <span>Billing</span>
              </el-dropdown-item>
              <el-dropdown-item command="team">
                <el-icon><UserFilled /></el-icon>
                <span>Team</span>
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided class="logout-item">
                <el-icon><SwitchButton /></el-icon>
                <span>Logout</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import {
  Bell,
  Search,
  Setting,
  ArrowDown,
  ArrowRight,
  User,
  CreditCard,
  UserFilled,
  SwitchButton,
  Tools,
  Lock,
  Sunny,
  Check,
  InfoFilled,
  Warning,
  Loading,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const searchInput = ref<HTMLInputElement | null>(null);
const notifications = ref<any[]>([]);
const unreadCount = ref(0);
const loadingNotifications = ref(false);

// User data from store
const userName = computed(() => authStore.userName);
const userRole = computed(() => authStore.userRole);
const userInitials = computed(() => authStore.userInitials);
const userAvatar = computed(() => authStore.user?.avatarUrl);
const userEmail = computed(() => authStore.user?.email);

// Fetch notifications
const fetchNotifications = async () => {
  try {
    loadingNotifications.value = true;
    const { data } = await useFetch('/api/notifications', {
      query: { limit: 5, read: false },
      credentials: 'include'
    });
    
    if (data.value) {
      notifications.value = data.value.notifications || [];
      unreadCount.value = data.value.unreadCount || 0;
    }
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
  } finally {
    loadingNotifications.value = false;
  }
};

// Format time
const formatTime = (date: Date | string) => {
  const now = new Date();
  const notificationDate = new Date(date);
  const diff = now.getTime() - notificationDate.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return notificationDate.toLocaleDateString();
};

// Mark notification as read
const markAsRead = async (id: string) => {
  try {
    await useFetch(`/api/notifications/${id}`, {
      method: 'PUT',
      body: { read: true },
      credentials: 'include'
    });
    await fetchNotifications();
  } catch (error) {
    ElMessage.error('Failed to mark notification as read');
  }
};

// Mark all as read
const markAllAsRead = async () => {
  try {
    await useFetch('/api/notifications/read-all', {
      method: 'PUT',
      credentials: 'include'
    });
    await fetchNotifications();
    ElMessage.success('All notifications marked as read');
  } catch (error) {
    ElMessage.error('Failed to mark all as read');
  }
};

// Load notifications on mount
onMounted(async () => {
  // Ensure auth store is initialized
  if (!authStore.initialized) {
    await authStore.initialize();
  }
  
  if (authStore.isAuthenticated) {
    fetchNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    onUnmounted(() => clearInterval(interval));
  }
});

const openSearch = () => {
  searchInput.value?.focus();
};

const handleSearchKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    searchInput.value?.blur();
  }
};

const handleNotificationClick = async (command: string) => {
  if (command.startsWith('notification-')) {
    const id = command.replace('notification-', '');
    const notification = notifications.value.find(n => n.id === id);
    if (notification && !notification.read) {
      await markAsRead(notification.id);
    }
    if (notification?.link) {
      navigateTo(notification.link);
    }
  }
};

const handleSettingsCommand = (command: string) => {
  switch (command) {
    case "preferences":
      ElMessage.info("Opening preferences...");
      navigateTo("/settings/preferences");
      break;
    case "account":
      ElMessage.info("Opening account settings...");
      navigateTo("/settings/account");
      break;
    case "privacy":
      ElMessage.info("Opening privacy settings...");
      navigateTo("/settings/privacy");
      break;
    case "notifications":
      ElMessage.info("Opening notification settings...");
      navigateTo("/settings/notifications");
      break;
    case "appearance":
      ElMessage.info("Opening appearance settings...");
      navigateTo("/settings/appearance");
      break;
  }
};

const handleUserCommand = async (command: string) => {
  switch (command) {
    case "profile":
      navigateTo("/profile");
      break;
    case "settings":
      navigateTo("/settings");
      break;
    case "billing":
      navigateTo("/billing");
      break;
    case "team":
      navigateTo("/team");
      break;
    case "logout":
      await authStore.signOut();
      break;
  }
};

// Global keyboard shortcut for search (Ctrl+K)
const handleGlobalKeydown = (event: KeyboardEvent) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "k") {
    event.preventDefault();
    searchInput.value?.focus();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleGlobalKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleGlobalKeydown);
});
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0;
  gap: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-center,
.header-right {
  display: flex;
  align-items: center;
}

.header-center {
  flex: 1;
  max-width: 600px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #10b981, #0ea5e9);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.03em;
}

.logo-badge {
  background: linear-gradient(135deg, #10b981, #0ea5e9);
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 16px;
  transition: all 0.3s ease;
  height: 44px;
  cursor: text;
}

.search-bar:focus-within {
  background: white;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.search-icon {
  color: #94a3b8;
  font-size: 18px;
  margin-right: 12px;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.875rem;
  color: #1e293b;
  padding: 0;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-shortcut {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-family: monospace;
  color: #64748b;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon-button {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
}

.icon-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  color: #10b981;
}

.notification-btn {
  position: relative;
}

.notification-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.divider {
  width: 1px;
  height: 32px;
  background: #e2e8f0;
  margin: 0 4px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px 6px 6px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-profile:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #10b981, #0ea5e9);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar.large {
  width: 48px;
  height: 48px;
  font-size: 1.125rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.2;
}

.user-role {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.2;
}

.dropdown-arrow {
  color: #94a3b8;
  font-size: 14px;
  transition: transform 0.2s ease;
}

.user-profile:hover .dropdown-arrow {
  transform: translateY(2px);
}

/* Notifications Dropdown Styles */
:deep(.notifications-dropdown) {
  min-width: 380px;
  max-width: 420px;
  padding: 0;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
}

.dropdown-header h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.mark-read-btn {
  background: none;
  border: none;
  color: #10b981;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.mark-read-btn:hover {
  background: rgba(16, 185, 129, 0.1);
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 4px 0;
}

.notification-item.unread {
  position: relative;
}

.notification-item.unread::before {
  content: "";
  position: absolute;
  left: -12px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
}

.notification-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.notification-icon.success {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.notification-icon.info {
  background: rgba(14, 165, 233, 0.1);
}

.notification-icon.warning {
  background: rgba(249, 115, 22, 0.1);
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.notification-text {
  font-size: 0.8125rem;
  color: #64748b;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 0.75rem;
  color: #94a3b8;
}

.loading-notifications {
  padding: 20px;
  text-align: center;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.no-notifications {
  padding: 40px 20px;
  text-align: center;
  color: #94a3b8;
}

.no-notifications p {
  margin: 0;
  font-size: 0.875rem;
}

.dropdown-footer {
  padding: 12px 20px;
  border-top: 1px solid #f1f5f9;
}

.view-all-btn {
  display: block;
  width: 100%;
  padding: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  text-align: center;
}

.view-all-btn:hover {
  background: #f1f5f9;
  color: #10b981;
  border-color: #cbd5e1;
}

/* Settings Dropdown Styles */
:deep(.settings-dropdown) {
  min-width: 260px;
  padding: 0;
}

:deep(.settings-dropdown .el-dropdown-menu__item) {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.875rem;
  color: #475569;
  transition: all 0.2s ease;
}

:deep(.settings-dropdown .el-dropdown-menu__item:hover) {
  background: #f8fafc;
  color: #10b981;
}

.view-all-settings-btn {
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #10b981, #0ea5e9);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
}

.view-all-settings-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

/* User Dropdown Styles */
:deep(.user-dropdown) {
  min-width: 260px;
  padding: 0;
}

.dropdown-user-header {
  display: flex;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f8fafc, #ffffff);
}

.user-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  justify-content: center;
}

.user-name-large {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1e293b;
}

.user-email {
  font-size: 0.8125rem;
  color: #64748b;
}

:deep(.user-dropdown .el-dropdown-menu__item) {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.875rem;
  color: #475569;
  transition: all 0.2s ease;
}

:deep(.user-dropdown .el-dropdown-menu__item:hover) {
  background: #f8fafc;
  color: #10b981;
}

:deep(.user-dropdown .el-dropdown-menu__item.logout-item) {
  color: #ef4444;
}

:deep(.user-dropdown .el-dropdown-menu__item.logout-item:hover) {
  background: rgba(239, 68, 68, 0.05);
  color: #dc2626;
}

:deep(.el-dropdown-menu__item .el-icon) {
  font-size: 18px;
}

@media (max-width: 1024px) {
  .header-center {
    max-width: 400px;
  }

  .user-info {
    display: none;
  }

  .dropdown-arrow {
    display: none;
  }
}

@media (max-width: 768px) {
  .app-header {
    gap: 12px;
  }

  .header-center {
    display: none;
  }

  .logo-badge {
    display: none;
  }

  :deep(.notifications-dropdown) {
    min-width: 320px;
  }
}
</style>
