<template>
  <div class="forgot-password-page">
    <h2 class="page-title">Reset Password</h2>
    <p class="page-subtitle">Enter your email to receive a reset link</p>

    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-position="top"
      size="large"
    >
      <el-form-item label="Email" prop="email">
        <el-input v-model.trim="form.email" placeholder="Enter your email" />
      </el-form-item>

      <el-button
        type="primary"
        class="submit-btn"
        size="large"
        @click="handleReset"
      >
        Send Reset Link
      </el-button>
    </el-form>

    <div class="auth-footer">
      <NuxtLink to="/auth/login" class="link">
        <span class="back-arrow">←</span> Back to Login
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";

definePageMeta({
  layout: "auth",
});

const formRef = ref<FormInstance>();

const form = ref({
  email: "",
});

// Validation rules
const rules = ref<FormRules>({
  email: [
    { required: true, message: "Email is required", trigger: "blur" },
    { type: "email", message: "Please enter a valid email", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value && value.trim() === "") {
          callback(new Error("Email cannot be only whitespace"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
});

const handleReset = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const trimmedEmail = form.value.email.trim();
        
        const { data, error } = await useFetch('/api/auth/forgot-password', {
          method: 'POST',
          body: { email: trimmedEmail }
        })
        
        if (error.value) {
          ElMessage.error(error.value.statusMessage || "Failed to send reset email");
        } else {
          ElMessage.success("If an account exists with this email, a password reset link has been sent.");
          form.value.email = '';
        }
      } catch (err: any) {
        ElMessage.error(err.message || "An error occurred. Please try again.");
      }
    } else {
      ElMessage.error("Please enter a valid email address");
    }
  });
};
</script>

<style scoped>
.forgot-password-page {
  width: 100%;
}

.page-title {
  text-align: center;
  margin: 0 0 12px;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--el-text-color-primary);
  letter-spacing: -0.025em;
}

.page-subtitle {
  text-align: center;
  margin: 0 0 32px;
  color: var(--el-text-color-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 8px;
}

:deep(.el-input__wrapper) {
  padding: 10px 16px;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-color-primary-light-7) inset;
}

.submit-btn {
  width: 100%;
  height: 44px;
  margin-top: 8px;
  font-weight: 600;
  letter-spacing: 0.025em;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.auth-footer {
  margin-top: 28px;
  text-align: center;
  font-size: 0.95rem;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.link {
  color: var(--el-color-primary);
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.link:hover {
  color: var(--el-color-primary-light-3);
  text-decoration: underline;
}

.back-arrow {
  font-size: 1.1rem;
  transition: transform 0.2s ease;
}

.link:hover .back-arrow {
  transform: translateX(-3px);
}
</style>
