<template>
  <div class="account-page">
    <div class="section-header">
      <h2 class="section-title">Account Settings</h2>
      <p class="section-description">Manage your account information and profile</p>
    </div>

    <el-form :model="form" label-width="200px" class="account-form">
      <el-card class="form-card" shadow="never">
        <template #header>
          <span class="card-title">Profile Information</span>
        </template>

        <el-form-item label="Full Name">
          <el-input v-model="form.name" placeholder="Enter your full name" />
        </el-form-item>

        <el-form-item label="Email">
          <el-input v-model="form.email" type="email" placeholder="Enter your email" disabled />
          <span class="form-help">Email cannot be changed</span>
        </el-form-item>

        <el-form-item label="Company">
          <el-input v-model="form.company" placeholder="Enter your company name" />
        </el-form-item>

        <el-form-item label="Avatar">
          <div class="avatar-section">
            <el-avatar :size="80" :src="form.avatarUrl" class="avatar-preview">
              <span v-if="!form.avatarUrl">{{ userInitials }}</span>
            </el-avatar>
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="handleAvatarUpload"
            >
              <el-button type="primary" plain>Upload Avatar</el-button>
            </el-upload>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="form-card" shadow="never">
        <template #header>
          <span class="card-title">Change Password</span>
        </template>

        <el-form-item label="Current Password">
          <el-input
            v-model="form.currentPassword"
            type="password"
            placeholder="Enter current password"
            show-password
          />
        </el-form-item>

        <el-form-item label="New Password">
          <el-input
            v-model="form.newPassword"
            type="password"
            placeholder="Enter new password"
            show-password
          />
          <span class="form-help">Must be at least 8 characters</span>
        </el-form-item>

        <el-form-item label="Confirm Password">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm new password"
            show-password
          />
        </el-form-item>
      </el-card>

      <div class="form-actions">
        <el-button type="primary" @click="handleSave" :loading="saving">
          Save Changes
        </el-button>
        <el-button @click="handleCancel">Cancel</el-button>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

definePageMeta({
  layout: 'default'
})

const authStore = useAuthStore()
const saving = ref(false)

const form = ref({
  name: '',
  email: '',
  company: '',
  avatarUrl: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const userInitials = computed(() => {
  return authStore.userInitials
})

onMounted(() => {
  if (authStore.user) {
    form.value.name = authStore.user.name || ''
    form.value.email = authStore.user.email || ''
    form.value.avatarUrl = authStore.user.avatarUrl || ''
  }
})

const handleAvatarUpload = (file: File) => {
  // TODO: Implement avatar upload
  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.avatarUrl = e.target?.result as string
    ElMessage.success('Avatar uploaded successfully')
  }
  reader.readAsDataURL(file)
  return false // Prevent auto upload
}

const handleSave = async () => {
  if (form.value.newPassword && form.value.newPassword !== form.value.confirmPassword) {
    ElMessage.error('New passwords do not match')
    return
  }

  if (form.value.newPassword && form.value.newPassword.length < 8) {
    ElMessage.error('New password must be at least 8 characters')
    return
  }

  saving.value = true
  try {
    // TODO: Save account changes to API
    await new Promise(resolve => setTimeout(resolve, 500))
    ElMessage.success('Account updated successfully!')
    
    // Update auth store
    if (authStore.user) {
      authStore.user.name = form.value.name
      authStore.user.avatarUrl = form.value.avatarUrl
    }
  } catch (error) {
    ElMessage.error('Failed to update account')
  } finally {
    saving.value = false
  }
}

const handleCancel = () => {
  if (authStore.user) {
    form.value.name = authStore.user.name || ''
    form.value.email = authStore.user.email || ''
    form.value.avatarUrl = authStore.user.avatarUrl || ''
  }
  form.value.currentPassword = ''
  form.value.newPassword = ''
  form.value.confirmPassword = ''
}
</script>

<style scoped>
.account-page {
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

.account-form {
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

.avatar-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-preview {
  border: 2px solid #e2e8f0;
}

.form-actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
}
</style>

