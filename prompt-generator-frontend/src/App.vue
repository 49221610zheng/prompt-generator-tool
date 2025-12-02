<template>
  <div class="app-container">
    <router-view />
    <div v-if="showHealthCheck" class="health-check">
      <div :class="['status', healthStatus]">{{ healthStatusText }}</div>
    </div>
  </div>
</template>

<script>
import './styles/responsive.css';

export default {
  name: 'App',
  data() {
    return {
      showHealthCheck: false,
      healthStatus: 'checking',
      healthStatusText: '正在检查服务健康状态...'
    }
  },
  mounted() {
    // 测试后端通信
    setTimeout(() => {
      this.checkBackendHealth()
    }, 1000)
  },
  methods: {
    async checkBackendHealth() {
      try {
        const response = await fetch('/api/health')
        if (response.ok) {
          const data = await response.json()
          this.healthStatus = 'healthy'
          this.healthStatusText = '后端服务运行正常'
          console.log('后端健康检查成功:', data)
        } else {
          this.healthStatus = 'unhealthy'
          this.healthStatusText = `后端服务状态异常: ${response.status}`
        }
      } catch (error) {
        this.healthStatus = 'error'
        this.healthStatusText = `后端通信失败: ${error.message}`
        console.error('后端健康检查失败:', error)
      } finally {
        this.showHealthCheck = true
      }
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f5f7fa;
}

.app-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

/* 健康检查样式 */
.health-check {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.status {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.status.checking {
  background-color: #e6f7ff;
  color: #1890ff;
}

.status.healthy {
  background-color: #f6ffed;
  color: #52c41a;
}

.status.unhealthy {
  background-color: #fff2e8;
  color: #fa8c16;
}

.status.error {
  background-color: #fff1f0;
  color: #ff4d4f;
}
</style>