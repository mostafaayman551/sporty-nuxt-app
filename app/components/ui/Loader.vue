<template>
  <div class="loader-container">
    <div class="loader-wrapper">
      <div class="spinner"></div>
      <p class="loading-text">Loading...</p>
    </div>
  </div>
</template>

<style scoped>
.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 200px;
  width: 100%;
}

.loader-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0; /* slate-200 */
  border-top: 4px solid #10b981; /* sporty-green */
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-text {
  color: #64748b; /* slate-500 */
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
