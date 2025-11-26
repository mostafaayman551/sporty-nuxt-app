<template>
  <div class="billing-page">
    <div class="page-header">
      <h1 class="page-title">Billing & Subscription</h1>
      <p class="page-subtitle">Manage your subscription and billing information</p>
    </div>

    <div class="billing-content">
      <el-card class="billing-card" shadow="never">
        <template #header>
          <span class="card-title">Current Plan</span>
        </template>
        <div class="plan-info">
          <div class="plan-name">Pro Plan</div>
          <div class="plan-price">$29<span class="price-period">/month</span></div>
          <el-button type="primary" plain>Upgrade Plan</el-button>
        </div>
      </el-card>

      <el-card class="billing-card" shadow="never">
        <template #header>
          <span class="card-title">Payment Method</span>
        </template>
        <div class="payment-info">
          <el-empty description="No payment method on file" />
          <el-button type="primary">Add Payment Method</el-button>
        </div>
      </el-card>

      <el-card class="billing-card" shadow="never">
        <template #header>
          <span class="card-title">Billing History</span>
        </template>
        <el-empty description="No billing history" />
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.billing-page {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
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

.billing-content {
  display: grid;
  gap: 24px;
}

.billing-card {
  padding: 24px;
}

.card-title {
  font-weight: 600;
  color: #1e293b;
}

.plan-info {
  text-align: center;
  padding: 24px 0;
}

.plan-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.plan-price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 24px;
}

.price-period {
  font-size: 1rem;
  color: #64748b;
  font-weight: 400;
}

.payment-info {
  text-align: center;
  padding: 24px 0;
}
</style>

