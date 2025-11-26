<template>
  <div class="notifications-page">
    <div class="section-header">
      <h2 class="section-title">Notification Settings</h2>
      <p class="section-description">Manage how and when you receive notifications</p>
    </div>

    <el-form :model="form" label-width="200px" class="notifications-form">
      <el-card class="form-card" shadow="never">
        <template #header>
          <span class="card-title">Email Notifications</span>
        </template>

        <el-form-item label="Workout Reminders">
          <el-switch v-model="form.emailWorkoutReminders" />
          <span class="form-help">Receive email reminders for scheduled workouts</span>
        </el-form-item>

        <el-form-item label="Weekly Summary">
          <el-switch v-model="form.emailWeeklySummary" />
          <span class="form-help">Get a weekly summary of your activity</span>
        </el-form-item>

        <el-form-item label="Achievement Notifications">
          <el-switch v-model="form.emailAchievements" />
          <span class="form-help">Get notified when you reach milestones</span>
        </el-form-item>

        <el-form-item label="Account Updates">
          <el-switch v-model="form.emailAccountUpdates" />
          <span class="form-help">Receive notifications about account changes</span>
        </el-form-item>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <span class="card-title">Push Notifications</span>
        </template>

        <el-form-item label="Enable Push Notifications">
          <el-switch v-model="form.pushEnabled" />
          <span class="form-help">Receive push notifications in your browser</span>
        </el-form-item>

        <template v-if="form.pushEnabled">
          <el-form-item label="Workout Reminders">
            <el-switch v-model="form.pushWorkoutReminders" />
          </el-form-item>

          <el-form-item label="Goal Achievements">
            <el-switch v-model="form.pushAchievements" />
          </el-form-item>

          <el-form-item label="Social Updates">
            <el-switch v-model="form.pushSocialUpdates" />
          </el-form-item>
        </template>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <span class="card-title">In-App Notifications</span>
        </template>

        <el-form-item label="Show Notification Badge">
          <el-switch v-model="form.showBadge" />
          <span class="form-help">Display notification count badge</span>
        </el-form-item>

        <el-form-item label="Notification Sound">
          <el-switch v-model="form.notificationSound" />
          <span class="form-help">Play sound when receiving notifications</span>
        </el-form-item>

        <el-form-item label="Notification Duration">
          <el-select v-model="form.notificationDuration" style="width: 100%">
            <el-option label="3 seconds" value="3" />
            <el-option label="5 seconds" value="5" />
            <el-option label="10 seconds" value="10" />
            <el-option label="Until dismissed" value="0" />
          </el-select>
        </el-form-item>
      </el-card>

      <div class="form-actions">
        <el-button type="primary" @click="handleSave" :loading="saving">
          Save Changes
        </el-button>
        <el-button @click="handleTestNotification">Test Notification</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'

definePageMeta({
  layout: 'default'
})

const saving = ref(false)

const form = ref({
  emailWorkoutReminders: true,
  emailWeeklySummary: true,
  emailAchievements: true,
  emailAccountUpdates: true,
  pushEnabled: false,
  pushWorkoutReminders: true,
  pushAchievements: true,
  pushSocialUpdates: false,
  showBadge: true,
  notificationSound: true,
  notificationDuration: '5'
})

const handleSave = async () => {
  saving.value = true
  try {
    // TODO: Save notification settings to API
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('Notification settings saved successfully!')
  } catch (error) {
    ElMessage.error('Failed to save notification settings')
  } finally {
    saving.value = false
  }
}

const handleTestNotification = () => {
  ElNotification({
    title: 'Test Notification',
    message: 'This is a test notification to show how notifications will appear.',
    type: 'success',
    duration: parseInt(form.value.notificationDuration) * 1000 || 5000
  })
}
</script>

<style scoped>
.notifications-page {
  width: 100%;
}

.section-header {
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.section-description {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
}

.notifications-form {
  max-width: 800px;
}

.form-card {
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.card-title {
  font-weight: 600;
  color: #1e293b;
}

:deep(.el-card__header) {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
}

:deep(.el-card__body) {
  padding: 24px;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #475569;
}

.form-help {
  margin-left: 12px;
  font-size: 0.875rem;
  color: #94a3b8;
}

.form-actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
}
</style>

