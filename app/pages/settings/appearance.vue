<template>
  <div class="appearance-page">
    <div class="section-header">
      <h2 class="section-title">Appearance</h2>
      <p class="section-description">Customize the look and feel of your application</p>
    </div>

    <el-form :model="form" label-width="200px" class="appearance-form">
      <el-card class="form-card" shadow="never">
        <template #header>
          <span class="card-title">Theme</span>
        </template>

        <el-form-item label="Color Scheme">
          <el-radio-group v-model="form.theme" @change="handleThemeChange">
            <el-radio label="light">
              <div class="theme-option">
                <span>Light</span>
                <div class="theme-preview light"></div>
              </div>
            </el-radio>
            <el-radio label="dark">
              <div class="theme-option">
                <span>Dark</span>
                <div class="theme-preview dark"></div>
              </div>
            </el-radio>
            <el-radio label="auto">
              <div class="theme-option">
                <span>System</span>
                <div class="theme-preview auto"></div>
              </div>
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Primary Color">
          <div class="color-picker-section">
            <el-color-picker v-model="form.primaryColor" />
            <el-input v-model="form.primaryColor" style="width: 120px; margin-left: 12px;" />
            <el-button type="primary" plain @click="handleResetColor">Reset</el-button>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <span class="card-title">Layout</span>
        </template>

        <el-form-item label="Sidebar Position">
          <el-radio-group v-model="form.sidebarPosition">
            <el-radio label="left">Left</el-radio>
            <el-radio label="right">Right</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Sidebar Behavior">
          <el-radio-group v-model="form.sidebarBehavior">
            <el-radio label="fixed">Fixed</el-radio>
            <el-radio label="auto">Auto Hide</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Compact Mode">
          <el-switch v-model="form.compactMode" />
          <span class="form-help">Reduce spacing for a more compact layout</span>
        </el-form-item>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <span class="card-title">Display</span>
        </template>

        <el-form-item label="Font Size">
          <el-slider
            v-model="form.fontSize"
            :min="12"
            :max="18"
            :step="1"
            show-stops
            :format-tooltip="(val) => `${val}px`"
          />
        </el-form-item>

        <el-form-item label="Animation Speed">
          <el-radio-group v-model="form.animationSpeed">
            <el-radio label="fast">Fast</el-radio>
            <el-radio label="normal">Normal</el-radio>
            <el-radio label="slow">Slow</el-radio>
            <el-radio label="off">Off</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Reduce Motion">
          <el-switch v-model="form.reduceMotion" />
          <span class="form-help">Reduce animations for better accessibility</span>
        </el-form-item>
      </el-card>

      <div class="form-actions">
        <el-button type="primary" @click="handleSave" :loading="saving">
          Save Changes
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
  theme: 'light',
  primaryColor: '#10b981',
  sidebarPosition: 'left',
  sidebarBehavior: 'fixed',
  compactMode: false,
  fontSize: 14,
  animationSpeed: 'normal',
  reduceMotion: false
})

const handleThemeChange = (theme: string) => {
  // TODO: Apply theme change
  ElMessage.info(`Theme changed to ${theme}`)
}

const handleResetColor = () => {
  form.value.primaryColor = '#10b981'
  ElMessage.info('Primary color reset to default')
}

const handleSave = async () => {
  saving.value = true
  try {
    // TODO: Save appearance settings to API
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('Appearance settings saved successfully!')
  } catch (error) {
    ElMessage.error('Failed to save appearance settings')
  } finally {
    saving.value = false
  }
}

const handleReset = () => {
  form.value = {
    theme: 'light',
    primaryColor: '#10b981',
    sidebarPosition: 'left',
    sidebarBehavior: 'fixed',
    compactMode: false,
    fontSize: 14,
    animationSpeed: 'normal',
    reduceMotion: false
  }
  ElMessage.info('Appearance settings reset to defaults')
}
</script>

<style scoped>
.appearance-page {
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

.appearance-form {
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

.theme-option {
  display: flex;
  align-items: center;
  gap: 12px;
}

.theme-preview {
  width: 40px;
  height: 24px;
  border-radius: 4px;
  border: 2px solid #e2e8f0;
}

.theme-preview.light {
  background: linear-gradient(to right, #ffffff 50%, #f8fafc 50%);
}

.theme-preview.dark {
  background: linear-gradient(to right, #1e293b 50%, #0f172a 50%);
}

.theme-preview.auto {
  background: linear-gradient(to right, #ffffff 33%, #1e293b 33%, #1e293b 66%, #0f172a 66%);
}

.color-picker-section {
  display: flex;
  align-items: center;
}

.form-actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
}
</style>

