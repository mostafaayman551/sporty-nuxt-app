<template>
  <div class="confirm-email-page">
    <div v-if="loading" class="loading-state">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <p>Verifying your email...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <el-icon class="error-icon"><CircleClose /></el-icon>
      <h2>Verification Failed</h2>
      <p>{{ error }}</p>
      <el-button type="primary" @click="navigateTo('/auth/login')">
        Go to Login
      </el-button>
    </div>
    
    <div v-else class="success-state">
      <el-icon class="success-icon"><CircleCheck /></el-icon>
      <h2>Email Verified!</h2>
      <p>Your email has been successfully verified. You can now log in to your account.</p>
      <el-button type="primary" @click="navigateTo('/auth/login')">
        Go to Login
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Loading, CircleClose, CircleCheck } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

definePageMeta({
  layout: 'auth'
})

const route = useRoute()
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  const token = route.query.token as string
  
  if (!token) {
    error.value = 'Verification token is missing'
    loading.value = false
    return
  }
  
  try {
    const { data, error: fetchError } = await useFetch(`/api/auth/confirm-email?token=${token}`)
    
    if (fetchError.value) {
      error.value = fetchError.value.statusMessage || 'Invalid or expired verification token'
    } else {
      ElMessage.success('Email verified successfully!')
    }
  } catch (err: any) {
    error.value = err.message || 'An error occurred during verification'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.confirm-email-page {
  width: 100%;
  text-align: center;
  padding: 40px 20px;
}

.loading-state,
.error-state,
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-icon {
  font-size: 48px;
  color: #10b981;
  animation: spin 1s linear infinite;
}

.error-icon {
  font-size: 64px;
  color: #ef4444;
}

.success-icon {
  font-size: 64px;
  color: #10b981;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
}

p {
  color: var(--el-text-color-regular);
  margin: 0;
}
</style>

