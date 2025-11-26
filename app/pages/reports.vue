<template>
  <div class="reports-page">
    <div class="page-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">Reports</h1>
          <p class="page-subtitle">View detailed reports and analytics</p>
        </div>
        <el-button type="primary">Generate Report</el-button>
      </div>
    </div>

    <div class="reports-content">
      <el-card class="reports-card" shadow="never">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="Weekly" name="weekly">
            <div class="report-placeholder">
              <el-empty description="Weekly report will be displayed here" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="Monthly" name="monthly">
            <div class="report-placeholder">
              <el-empty description="Monthly report will be displayed here" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="Yearly" name="yearly">
            <div class="report-placeholder">
              <el-empty description="Yearly report will be displayed here" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'default'
})

const activeTab = ref('weekly')
</script>

<style scoped>
.reports-page {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.reports-card {
  padding: 24px;
}

.report-placeholder {
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

