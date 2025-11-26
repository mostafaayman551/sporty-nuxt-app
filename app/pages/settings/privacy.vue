<template>
  <div class="privacy-page">
    <div class="section-header">
      <h2 class="section-title">Privacy & Security</h2>
      <p class="section-description">Manage your privacy settings and security preferences</p>
    </div>

    <el-form :model="form" label-width="200px" class="privacy-form">
      <el-card class="form-card" shadow="never">
        <template #header>
          <span class="card-title">Privacy Settings</span>
        </template>

        <el-form-item label="Profile Visibility">
          <el-radio-group v-model="form.profileVisibility">
            <el-radio label="public">Public</el-radio>
            <el-radio label="private">Private</el-radio>
            <el-radio label="friends">Friends Only</el-radio>
          </el-radio-group>
          <span class="form-help">Control who can see your profile and workouts</span>
        </el-form-item>

        <el-form-item label="Show Activity Status">
          <el-switch v-model="form.showActivityStatus" />
          <span class="form-help">Let others see when you're active</span>
        </el-form-item>

        <el-form-item label="Allow Workout Sharing">
          <el-switch v-model="form.allowWorkoutSharing" />
          <span class="form-help">Allow others to view your public workouts</span>
        </el-form-item>

        <el-form-item label="Data Collection">
          <el-switch v-model="form.allowDataCollection" />
          <span class="form-help">Help improve our service by sharing anonymous usage data</span>
        </el-form-item>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <span class="card-title">Security Settings</span>
        </template>

        <el-form-item label="Two-Factor Authentication">
          <div class="security-item">
            <el-switch v-model="form.twoFactorEnabled" />
            <span class="form-help">Add an extra layer of security to your account</span>
          </div>
        </el-form-item>

        <el-form-item label="Login Notifications">
          <el-switch v-model="form.loginNotifications" />
          <span class="form-help">Get notified when someone logs into your account</span>
        </el-form-item>

        <el-form-item label="Active Sessions">
          <el-button type="primary" plain @click="handleViewSessions">
            View Active Sessions
          </el-button>
          <span class="form-help">Manage devices where you're logged in</span>
        </el-form-item>
      </el-card>

      <el-card class="form-card danger-zone" shadow="never">
        <template #header>
          <span class="card-title danger-title">Danger Zone</span>
        </template>

        <el-form-item label="Delete Account">
          <el-button type="danger" plain @click="handleDeleteAccount">
            Delete My Account
          </el-button>
          <span class="form-help danger-text">Permanently delete your account and all data</span>
        </el-form-item>

        <el-form-item label="Export Data">
          <el-button type="primary" plain @click="handleExportData">
            Export My Data
          </el-button>
          <span class="form-help">Download all your data in JSON format</span>
        </el-form-item>
      </el-card>

      <div class="form-actions">
        <el-button type="primary" @click="handleSave" :loading="saving">
          Save Changes
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

definePageMeta({
  layout: 'default'
})

const saving = ref(false)

const form = ref({
  profileVisibility: 'private',
  showActivityStatus: true,
  allowWorkoutSharing: false,
  allowDataCollection: true,
  twoFactorEnabled: false,
  loginNotifications: true
})

const handleSave = async () => {
  saving.value = true
  try {
    // TODO: Save privacy settings to API
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('Privacy settings saved successfully!')
  } catch (error) {
    ElMessage.error('Failed to save privacy settings')
  } finally {
    saving.value = false
  }
}

const handleViewSessions = () => {
  ElMessage.info('Active sessions feature coming soon')
}

const handleDeleteAccount = async () => {
  try {
    await ElMessageBox.confirm(
      'This will permanently delete your account and all associated data. This action cannot be undone.',
      'Delete Account',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
        dangerouslyUseHTMLString: false
      }
    )
    // TODO: Implement account deletion
    ElMessage.success('Account deletion requested')
  } catch {
    // User cancelled
  }
}

const handleExportData = async () => {
  ElMessage.info('Data export feature coming soon')
}
</script>

<style scoped>
.privacy-page {
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

.privacy-form {
  max-width: 800px;
}

.form-card {
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.form-card.danger-zone {
  border-color: #fca5a5;
}

.card-title {
  font-weight: 600;
  color: #1e293b;
}

.danger-title {
  color: #dc2626;
}

:deep(.el-card__header) {
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
}

.danger-zone :deep(.el-card__header) {
  background: #fef2f2;
  border-bottom-color: #fca5a5;
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

.danger-text {
  color: #dc2626;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
}
</style>

