/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import { setupLayouts } from 'virtual:generated-layouts'
// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'
import { useAppStore } from '@/stores/app'

const newRouters = []
// 生成 路由
const genRoutes = items => {
  items.forEach(v => {
    if (v && v.name && (v.children ?? []).length <= 0) {
      if (v && v.meta && v.meta.isLayout === true) {
        newRouters.push(setupLayouts([{ ...v }])[0])
      } else {
        newRouters.push({ ...v, path: v.path.indexOf('/') === 0 ? v.path : '/' + v.path })
      }
    } else if (v && v.children && v.children.length > 0) {
      const newChild = []
      for (let i = 0; i < v.children.length; i++) {
        const child = v.children[i]
        if (child.path) {
          newChild.push(child)
        }
      }
      for (let index = 0; index < newChild.length; index++) {
        const element = newChild[index]
        const p = v.path.indexOf('/') === 0 ? v.path : '/' + v.path
        genRoutes([
          {
            ...element,
            path: p + '/' + element.path,
          },
        ])
      }
    }
  })
}
genRoutes(routes)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: newRouters,
})

router.beforeEach(async (to, from) => {
  const appStore = useAppStore()
  appStore.appLoading = true
  // 用户在弹框点击“好”后会重新触发跳转，这一次需要放行。
  if (appStore.consumeSkipUnsavedInputDataCheck()) {
    return true
  }
  const fromTabValue = appStore.getRouteTabValue(from)
  const toTabValue = appStore.getRouteTabValue(to)
  // 离开当前 tab 前检查 inputData；有变化则打开弹框并阻止本次跳转。
  if (fromTabValue && fromTabValue !== toTabValue && appStore.hasUnsavedInputData(fromTabValue)) {
    appStore.openUnsavedInputDataDialog(() => {
      // 确认继续跳转时只跳过重试的这一次检查。
      appStore.skipNextUnsavedInputDataCheck()
      router.push(to.fullPath)
    })
    appStore.appLoading = false
    return false
  }
  if (to.meta.requiresAuth) {
    await appStore.fetchAppConfig()
    const tt = sessionStorage.getItem('token')
    if (tt) {
      // await checkSession()
      let p = true
      if (to.meta.permissions) {
        p = appStore.auth.isGranted(to.meta.permissions)
        if (!p) {
          return {
            name: '401',
            replace: true,
          }
        }
      }
      if (p) {
        return true
        // if (Object.keys(from.query).length > 0 && from.query.redirect) {
        //   const redirect = from.query.redirect
        //   if (to.path === redirect) {
        //     return true
        //   } else {
        //     from.query.redirect = null
        //     // /booking?aaa=123
        //     if (redirect.indexOf('?') > 0) {
        //       const u = redirect.slice(0, Math.max(0, redirect.indexOf('?')))
        //       const q = getAllQueryParams(redirect)
        //       return { path: u, replace: true, query: { ...q } }
        //     } else {
        //       return { path: redirect, replace: true }
        //     }
        //   }
        // } else {
        //   return true
        // }
      }
    } else {
      return {
        name: 'login',
        query: {
          redirect: to.fullPath, // redirect是指登录之后可以跳回到redirect指定的页面
        },
        replace: true,
      }
    }
  } else {
    return true
  }
})
router.afterEach(() => {
  const appStore = useAppStore()
  appStore.appLoading = false
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  const appStore = useAppStore()
  appStore.appLoading = false
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  const appStore = useAppStore()
  appStore.appLoading = false
  localStorage.removeItem('vuetify:dynamic-reload')
})

// This will update routes at runtime without reloading the page
if (import.meta.hot) {
  handleHotUpdate(router)
}

// const getAllQueryParams = url => {
//   const params = {}
//   const regex = /[?&]([^=#]+)=([^&#]*)/g
//   let match
//   while ((match = regex.exec(url ?? window.location.search)) !== null) {
//     params[decodeURIComponent(match[1])] = decodeURIComponent(match[2])
//   }
//   return params
// }

export default router
