<template>
  <div class="signup-page">
    <h2 class="page-title">Create Account</h2>
    <p class="page-subtitle">Join Sporty today</p>

    <div class="oauth-buttons">
      <el-button class="oauth-btn" size="large" @click="handleGoogleSignup">
        <Icon name="logos:google-icon" class="oauth-icon" />
        <span>Sign up with Google</span>
      </el-button>
      <el-button class="oauth-btn" size="large" @click="handleGithubSignup">
        <Icon name="logos:github-icon" class="oauth-icon" />
        <span>Sign up with GitHub</span>
      </el-button>
    </div>

    <el-divider>Or sign up with email</el-divider>

    <el-form
      :model="form"
      :rules="rules"
      ref="formRef"
      label-position="top"
      size="large"
    >
      <el-form-item label="Full Name" prop="name">
        <el-input v-model.trim="form.name" placeholder="Enter your full name" />
      </el-form-item>

      <el-form-item label="Email" prop="email">
        <el-input v-model.trim="form.email" placeholder="Enter your email" />
      </el-form-item>

      <el-form-item label="Password" prop="password">
        <el-input
          v-model.trim="form.password"
          type="password"
          placeholder="Create a password"
          show-password
        />
      </el-form-item>

      <el-button
        type="primary"
        class="submit-btn"
        size="large"
        @click="handleSignup"
      >
        Create Account
      </el-button>
    </el-form>

    <div class="auth-footer">
      <span>Already have an account?</span>
      <NuxtLink to="/auth/login" class="link">Log in</NuxtLink>
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
  name: "",
  email: "",
  password: "",
});

const config = useRuntimeConfig()
const handleGoogleSignup = () => {
  const baseUrl = config.public.baseUrl || 'http://localhost:3000'
  const redirectUri = encodeURIComponent(`${baseUrl}/api/auth/oauth/google`)
  const state = encodeURIComponent('/')
  const clientId = config.public.googleClientId
  
  if (!clientId) {
    ElMessage.error('Google OAuth is not configured. Please add NUXT_PUBLIC_GOOGLE_CLIENT_ID to your .env file')
    return
  }
  
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile&state=${state}`
  window.location.href = googleAuthUrl
}

const handleGithubSignup = () => {
  const baseUrl = config.public.baseUrl || 'http://localhost:3000'
  const redirectUri = encodeURIComponent(`${baseUrl}/api/auth/oauth/github`)
  const state = encodeURIComponent('/')
  const clientId = config.public.githubClientId
  
  if (!clientId) {
    ElMessage.error('GitHub OAuth is not configured. Please add NUXT_PUBLIC_GITHUB_CLIENT_ID to your .env file')
    return
  }
  
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email&state=${state}`
  window.location.href = githubAuthUrl
}

// Validation rules
const rules = ref<FormRules>({
  name: [
    { required: true, message: "Full name is required", trigger: "blur" },
    { min: 2, message: "Name must be at least 2 characters", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value && value.trim() === "") {
          callback(new Error("Name cannot be only whitespace"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
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
  password: [
    { required: true, message: "Password is required", trigger: "blur" },
    {
      min: 6,
      message: "Password must be at least 6 characters",
      trigger: "blur",
    },
    {
      validator: (rule, value, callback) => {
        if (value && value.trim() === "") {
          callback(new Error("Password cannot be only whitespace"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
});

const authStore = useAuthStore();

const handleSignup = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid) => {
    if (valid) {
      // Trim values before submission
      const trimmedData = {
        name: form.value.name.trim(),
        email: form.value.email.trim(),
        password: form.value.password.trim(),
      };
      
      const { error, message } = await authStore.signUp(trimmedData.email, trimmedData.password, trimmedData.name);
      
      if (error) {
        ElMessage.error(error.statusMessage || "Signup failed. Please try again.");
      } else {
        ElMessage.success(message || "Account created! Please check your email to confirm your account.");
        await navigateTo("/auth/login");
      }
    } else {
      ElMessage.error("Please fill in all required fields correctly");
    }
  });
};
</script>

<style scoped>
.signup-page {
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

.oauth-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.oauth-btn {
  width: 100%;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  border: 1px solid var(--el-border-color);
  transition: all 0.3s ease;
}

.oauth-icon {
  width: 20px;
  height: 20px;
}

.oauth-btn:hover {
  border-color: var(--el-color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

:deep(.el-divider) {
  margin: 24px 0;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
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
  font-size: 0.9rem;
  color: var(--el-text-color-regular);
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.link {
  color: var(--el-color-primary);
  text-decoration: none;
  font-weight: 600;
  margin-left: 6px;
  transition: all 0.2s ease;
}

.link:hover {
  color: var(--el-color-primary-light-3);
  text-decoration: underline;
}
</style>
