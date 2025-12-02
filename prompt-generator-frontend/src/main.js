import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
// 导入性能监控工具
import performanceMetricsCollector from './utils/performanceMetricsCollector'
// 导入错误处理增强模块
import { enhancedErrorHandler, userPathTracker, setupGlobalErrorHandler } from './utils/errorHandler.jsx'
// 导入日志系统
import logger, { LOG_LEVELS } from './utils/logger'

// 初始化日志系统
logger.configure({
  level: import.meta.env.DEV ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO,
  enableStorage: true,
  maxStorageSize: 200,
  performanceTracking: true
})

logger.info('应用初始化开始', {
  version: '1.0.0',
  env: import.meta.env.MODE
})

const app = createApp(App)

// 初始化性能监控工具
performanceMetricsCollector.init()

// 初始化错误处理模块
setupGlobalErrorHandler({
  performanceMetrics: performanceMetricsCollector
})

// 初始化用户路径跟踪器
userPathTracker.init()

// 添加工具到应用实例
app.config.globalProperties.$performanceMetrics = performanceMetricsCollector
app.config.globalProperties.$errorHandler = enhancedErrorHandler
app.config.globalProperties.$userPathTracker = userPathTracker
// 添加日志事件方法
app.config.globalProperties.$logEvent = function(eventName, eventData = {}) {
  console.log(`事件日志: ${eventName}`, eventData)
  // 这里可以添加实际的日志发送逻辑
}

app.use(ElementPlus)
app.use(router)

// 全局注入日志器
app.config.globalProperties.$logger = logger
app.provide('logger', logger)

// 在路由守卫中记录页面加载性能和用户路径
router.beforeEach((to, from, next) => {
  // 记录导航开始时间
  to.meta.startTime = Date.now()
  
  // 记录用户导航路径
  userPathTracker.record('page_navigation', {
    from: from.name || 'initial',
    to: to.name || 'unknown',
    params: to.params,
    query: to.query
  })
  
  next()
})

router.afterEach((to, from) => {
  // 导航完成后记录耗时
  const navigationTime = Date.now() - (to.meta.startTime || Date.now())
  performanceMetricsCollector.recordMetric('navigation_time', navigationTime, { 
    page: to.name || 'unknown',
    from: from.name || 'initial'
  })
  
  // 记录页面加载完成
  userPathTracker.record('page_loaded', {
    page: to.name || 'unknown',
    loadTime: navigationTime
  })
})

app.mount('#app')