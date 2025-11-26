<template>
  <div class="team-page">
    <div class="page-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">Team</h1>
          <p class="page-subtitle">Manage your team members and permissions</p>
        </div>
        <el-button type="primary">Invite Member</el-button>
      </div>
    </div>

    <div class="team-content">
      <el-card class="team-card" shadow="never">
        <el-table :data="teamMembers" style="width: 100%">
          <el-table-column prop="name" label="Name" />
          <el-table-column prop="email" label="Email" />
          <el-table-column prop="role" label="Role" />
          <el-table-column prop="status" label="Status">
            <template #default="{ row }">
              <el-tag :type="row.status === 'Active' ? 'success' : 'info'">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="Actions">
            <template #default>
              <el-button text type="primary" size="small">Edit</el-button>
              <el-button text type="danger" size="small">Remove</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'default'
})

const teamMembers = ref([
  {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
    status: 'Active'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Member',
    status: 'Active'
  }
])
</script>

<style scoped>
.team-page {
  width: 100%;
  max-width: 1200px;
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

.team-card {
  padding: 24px;
}
</style>

