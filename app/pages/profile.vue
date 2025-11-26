<template>
  <div class="profile-page">
    <div class="profile-header">
      <h1 class="page-title">Profile</h1>
      <p class="page-subtitle">Manage your profile information</p>
    </div>

    <div class="profile-content">
      <el-card class="profile-card" shadow="never">
        <div class="profile-avatar-section">
          <el-avatar :size="120" :src="authStore.user?.avatarUrl" class="profile-avatar">
            <span v-if="!authStore.user?.avatarUrl">{{ authStore.userInitials }}</span>
          </el-avatar>
          <el-button type="primary" plain @click="handleEditAvatar">
            Change Avatar
          </el-button>
        </div>

        <el-descriptions :column="1" border class="profile-details">
          <el-descriptions-item label="Name">
            {{ authStore.user?.name || 'Not set' }}
          </el-descriptions-item>
          <el-descriptions-item label="Email">
            {{ authStore.user?.email }}
          </el-descriptions-item>
          <el-descriptions-item label="Role">
            {{ authStore.user?.role }}
          </el-descriptions-item>
          <el-descriptions-item label="Company">
            {{ authStore.user?.company || 'Not set' }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="profile-actions">
          <el-button type="primary" @click="navigateTo('/settings/account')">
            Edit Profile
          </el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'default'
})

const authStore = useAuthStore()

const handleEditAvatar = () => {
  navigateTo('/settings/account')
}
</script>

<style scoped>
.profile-page {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.profile-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #64748b;
  margin: 0;
}

.profile-card {
  padding: 40px;
}

.profile-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
}

.profile-avatar {
  border: 4px solid #e2e8f0;
}

.profile-details {
  margin-bottom: 32px;
}

.profile-actions {
  display: flex;
  justify-content: center;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}
</style>

