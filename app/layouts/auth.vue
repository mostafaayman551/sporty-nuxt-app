<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-header">
        <h1 class="logo-text">Sporty</h1>
        <div class="logo-tagline">Your Fitness Journey Starts Here</div>
      </div>
      <div class="auth-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 20px;
}

.auth-container {
  width: 100%;
  max-width: 440px;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-text {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--el-color-primary), #10b981);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 8px;
  letter-spacing: -0.05em;
}

.logo-tagline {
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
  font-weight: 500;
  letter-spacing: 0.025em;
}

.auth-content {
  background-color: #fff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

@media (max-width: 640px) {
  .auth-content {
    padding: 28px 24px;
  }

  .logo-text {
    font-size: 2rem;
  }
}
</style>
