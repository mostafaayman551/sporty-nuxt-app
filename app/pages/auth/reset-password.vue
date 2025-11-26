<template>
  <div class="reset-password-page">
    <h2 class="page-title">Reset Password</h2>
    <p class="page-subtitle">Enter your new password</p>

    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-position="top"
      size="large"
    >
      <el-form-item label="New Password" prop="password">
        <el-input
          v-model.trim="form.password"
          type="password"
          placeholder="Enter new password"
          show-password
        />
      </el-form-item>

      <el-form-item label="Confirm Password" prop="confirmPassword">
        <el-input
          v-model.trim="form.confirmPassword"
          type="password"
          placeholder="Confirm new password"
          show-password
        />
      </el-form-item>

      <el-button
        type="primary"
        class="submit-btn"
        size="large"
        @click="handleReset"
        :loading="loading"
      >
        Reset Password
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
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";

definePageMeta({
  layout: "auth",
});

const route = useRoute();
const formRef = ref<FormInstance>();
const loading = ref(false);
const token = ref<string | null>(null);

const form = ref({
  password: "",
  confirmPassword: "",
});

// Validation rules
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== form.value.password) {
    callback(new Error("Passwords do not match"));
  } else {
    callback();
  }
};

const rules = ref<FormRules>({
  password: [
    { required: true, message: "Password is required", trigger: "blur" },
    {
      min: 6,
      message: "Password must be at least 6 characters",
      trigger: "blur",
    },
  ],
  confirmPassword: [
    { required: true, message: "Please confirm your password", trigger: "blur" },
    { validator: validateConfirmPassword, trigger: "blur" },
  ],
});

onMounted(() => {
  token.value = (route.query.token as string) || null;
  if (!token.value) {
    ElMessage.error("Invalid reset token");
    navigateTo("/auth/forgot-password");
  }
});

const handleReset = async () => {
  if (!formRef.value || !token.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const { data, error } = await useFetch("/api/auth/reset-password", {
          method: "POST",
          body: {
            token: token.value,
            password: form.value.password.trim(),
          },
        });

        if (error.value) {
          ElMessage.error(error.value.statusMessage || "Failed to reset password");
        } else {
          ElMessage.success("Password reset successfully! Logging you in...");
          await new Promise(resolve => setTimeout(resolve, 1000));
          await navigateTo("/");
        }
      } catch (err: any) {
        ElMessage.error(err.message || "An error occurred. Please try again.");
      } finally {
        loading.value = false;
      }
    } else {
      ElMessage.error("Please fill in all fields correctly");
    }
  });
};
</script>

<style scoped>
.reset-password-page {
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

