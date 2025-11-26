<template>
  <div class="preferences-page">
    <div class="section-header">
      <h2 class="section-title">Preferences</h2>
      <p class="section-description">Customize your application preferences</p>
    </div>

    <el-form :model="form" label-width="200px" class="preferences-form">
      <el-card class="form-card" shadow="never">
        <template #header>
          <span class="card-title">General Settings</span>
        </template>

        <el-form-item label="Language">
          <el-select v-model="form.language" placeholder="Select language" style="width: 100%">
            <el-option label="English" value="en" />
            <el-option label="Spanish" value="es" />
            <el-option label="French" value="fr" />
            <el-option label="German" value="de" />
          </el-select>
        </el-form-item>

        <el-form-item label="Time Zone">
          <el-select v-model="form.timezone" placeholder="Select timezone" style="width: 100%">
            <el-option label="UTC" value="UTC" />
            <el-option label="EST (Eastern)" value="America/New_York" />
            <el-option label="PST (Pacific)" value="America/Los_Angeles" />
            <el-option label="GMT (London)" value="Europe/London" />
          </el-select>
        </el-form-item>

        <el-form-item label="Date Format">
          <el-radio-group v-model="form.dateFormat">
            <el-radio label="MM/DD/YYYY">MM/DD/YYYY</el-radio>
            <el-radio label="DD/MM/YYYY">DD/MM/YYYY</el-radio>
            <el-radio label="YYYY-MM-DD">YYYY-MM-DD</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Time Format">
          <el-radio-group v-model="form.timeFormat">
            <el-radio label="12h">12 Hour</el-radio>
            <el-radio label="24h">24 Hour</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <span class="card-title">Workout Preferences</span>
        </template>

        <el-form-item label="Default Workout Duration">
          <el-input-number
            v-model="form.defaultWorkoutDuration"
            :min="5"
            :max="180"
            :step="5"
            style="width: 100%"
          />
          <span class="form-help">minutes</span>
        </el-form-item>

        <el-form-item label="Auto-save Workouts">
          <el-switch v-model="form.autoSaveWorkouts" />
          <span class="form-help">Automatically save workouts as you log them</span>
        </el-form-item>

        <el-form-item label="Show Workout Reminders">
          <el-switch v-model="form.showWorkoutReminders" />
        </el-form-item>
      </el-card>

      <div class="form-actions">
        <el-button type="primary" @click="handleSave" :loading="saving">
          Save Preferences
        </el-button>
        <el-button @click="handleReset">Reset to Defaults</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

definePageMeta({
  layout: 'default'
})

const saving = ref(false)

const form = ref({
  language: 'en',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  defaultWorkoutDuration: 30,
  autoSaveWorkouts: true,
  showWorkoutReminders: true
})

const handleSave = async () => {
  saving.value = true
  try {
    // TODO: Save preferences to API
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('Preferences saved successfully!')
  } catch (error) {
    ElMessage.error('Failed to save preferences')
  } finally {
    saving.value = false
  }
}

const handleReset = () => {
  form.value = {
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    defaultWorkoutDuration: 30,
    autoSaveWorkouts: true,
    showWorkoutReminders: true
  }
  ElMessage.info('Preferences reset to defaults')
}
</script>

<style scoped>
.preferences-page {
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

.preferences-form {
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

