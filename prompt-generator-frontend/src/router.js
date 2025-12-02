import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./pages/HomePage.vue'),
    meta: {
      title: '首页',
      requiresAuth: false // 首页不需要认证也可以访问
    }
  },
  {
    path: '/questioning',
    name: 'questioning',
    component: () => import('./pages/QuestioningPage.vue'),
    meta: {
      title: '智能提问',
      requiresAuth: false // 智能提问页面不需要认证也可以访问
    }
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('./pages/HistoryPage.vue'),
    meta: {
      title: '历史记录',
      requiresAuth: true, // 历史记录页面需要认证
      roles: [] // 所有登录用户都可以访问
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./pages/LoginPage.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
      guestOnly: true // 只允许未登录用户访问
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('./pages/RegisterPage.vue'),
    meta: {
      title: '注册',
      requiresAuth: false,
      guestOnly: true // 只允许未登录用户访问
    }
  },
  {
    path: '/performance-dashboard',
    name: 'performance-dashboard',
    component: () => import('./pages/PerformanceDashboardPage.vue'),
    meta: {
      title: '性能仪表板',
      requiresAuth: true,
      roles: ['admin'] // 仅管理员可访问
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('./pages/HomePage.vue'),
    meta: {
      title: '页面未找到',
      requiresAuth: false
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 权限控制路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 提示词生成工具`
  } else {
    document.title = '提示词生成工具'
  }
  
  // 获取token和用户信息
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    // 需要认证的页面
    if (!token) {
      // 未登录，跳转到登录页面
      ElMessage.warning('请先登录')
      next({ name: 'login', query: { redirect: to.fullPath } })
    } else {
      // 已登录，检查角色权限
      if (to.meta.roles && to.meta.roles.length > 0) {
        const userRoles = user?.roles || ['user']
        const hasPermission = to.meta.roles.some(role => userRoles.includes(role))
        
        if (!hasPermission) {
          ElMessage.error('您没有权限访问此页面')
          next({ name: 'home' })
        } else {
          next()
        }
      } else {
        // 没有角色限制，直接通过
        next()
      }
    }
  } else if (to.meta.guestOnly) {
    // 只允许未登录用户访问的页面（登录、注册等）
    if (token) {
      // 已登录，跳转到首页
      ElMessage.info('您已登录')
      next({ name: 'home' })
    } else {
      next()
    }
  } else {
    // 其他页面直接通过
    next()
  }
})

// 全局错误处理
router.onError((error) => {
  console.error('路由错误:', error)
  ElMessage.error('页面加载失败，请刷新重试')
})

export default router