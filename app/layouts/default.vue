<template>
  <div class="common-layout">
    <el-container class="main-container">
      <el-aside width="auto">
        <LayoutSidebar />
      </el-aside>
      <el-container class="content-wrapper">
        <el-header>
          <LayoutHeader />
        </el-header>
        <el-main>
          <slot />
        </el-main>
        <el-footer>
          <LayoutFooter />
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.main-container {
  min-height: 100vh;
  background-color: #f8fafc;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.el-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  color: #1e293b;
  padding: 0 32px;
  height: 72px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  position: sticky;
  top: 0;
  z-index: 100;
}

.el-main {
  background-color: #f8fafc;
  padding: 48px 32px;
  color: #1e293b;
  overflow-x: hidden;
  flex: 1;
}

.el-footer {
  padding: 0;
  height: auto;
  margin-top: auto;
}

.el-aside {
  background-color: #ffffff;
  border-right: 1px solid #e2e8f0;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 1px 0 3px rgba(0, 0, 0, 0.02);
  position: relative;
  z-index: 101;
}

@media (max-width: 768px) {
  .el-header {
    padding: 0 20px;
    height: 64px;
  }

  .el-main {
    padding: 32px 20px;
  }
}

@media (max-width: 640px) {
  .el-main {
    padding: 24px 16px;
  }
}
</style>
