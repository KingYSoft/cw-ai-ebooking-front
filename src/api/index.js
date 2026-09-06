import axios from 'axios'
// import i18n from '@/plugins/vuei18n'
import vuetify from '@/plugins/vuetify'
// import router from '@/router'
import { useAppStore } from '@/stores/app'
import {
  clearAuthSession,
  getAccessToken,
  getAuthSessionPayload,
  getRefreshToken,
  setAuthSession,
} from '@/utils/authSession'
import { getFacadeLanguageCulture } from '@/utils/locale'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 90 * 1000,
})
const baseURL = import.meta.env.VITE_APP_BASE_API || ''

// 多个请求同时遇到 401 时共用同一个刷新请求，避免并发刷新风暴。
let refreshPromise = null
let loginExpiredMessageShown = false

const shouldSkipAuthRefresh = config => {
  // 登录、刷新、登出接口自身不再触发刷新，防止递归调用。
  const url = config?.url ?? ''
  return (
    config?._retry ||
    url.includes('/user/login') ||
    url.includes('/user/refresh-token') ||
    url.includes('/user/logout')
  )
}

const normalizeResponseData = response => {
  const responseData = response?.data
  return responseData?.data ?? responseData?.Data ?? responseData
}

const requestRelogin = () => {
  // 刷新失败或后端返回 code=401 时，不跳转 login，改为打开全局重新登录弹框。
  clearAuthSession()
  const appStore = useAppStore()
  appStore.openReloginDialog()
  if (!loginExpiredMessageShown) {
    loginExpiredMessageShown = true
    appStore.openMessage({
      content: vuetify.locale.t('$vuetify.custom.app.http.err_401msg'),
      color: 'error',
    })
    window.setTimeout(() => {
      loginExpiredMessageShown = false
    }, 1000)
  }
}

const refreshAccessToken = async () => {
  const payload = getAuthSessionPayload()
  if (!payload.access_token || !payload.refresh_token) {
    throw new Error('Missing refresh token')
  }

  // 使用原生 axios 调刷新接口，避免走当前 service 拦截器产生递归刷新。
  const response = await axios.post(`${baseURL}/user/refresh-token`, payload, {
    timeout: 90 * 1000,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = normalizeResponseData(response)
  if (!data?.access_token) {
    throw new Error('Refresh token response is invalid')
  }

  setAuthSession(data)
  const appStore = useAppStore()
  // token 刷新成功后通知 SignalR 使用最新 token 重连。
  appStore.event.trigger('auth.tokenRefreshed')
  return data.access_token
}

service.interceptors.request.use(
  config => {
    // const cookieLangValue = 'zh-Hans' // getCookieValue('Localization.CultureName')
    const lang = localStorage.getItem('lang') || ''
    const cookieLangValue = getFacadeLanguageCulture(lang)
    // 每次请求都读取最新 access token，避免刷新后继续使用旧 token。
    const token = getAccessToken()
    if (config.data instanceof FormData) {
      // FormData 须由 axios 自动带 boundary，不可强制 application/json
      delete config.headers['Content-Type']
    } else {
      config.headers['Content-Type'] = 'application/json'
    }
    config.headers['Facade-Language'] = `c=${cookieLangValue}|uic=${cookieLangValue}`
    // config.headers = {
    //   'Content-Type': 'application/json',
    //   'Facade-Language': `c=${cookieLangValue}|uic=${cookieLangValue}`,
    //   ...config.headers,
    // }
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return Promise.resolve(config)
  },
  error => {
    // console.log(error, 'request error')
    return Promise.reject(error)
  },
)
service.interceptors.response.use(
  res => {
    if (res && res.data) {
      if (res.data.errCode === 401) {
        // 后端 JsonResponse code=401 表示必须重新登录。
        requestRelogin()
        return Promise.reject(new Error(res.data.msg ?? 'Login is invalid, please login again.'))
      }
      if (res.data.errCode === -1) {
        const appStore = useAppStore()
        appStore.openMessage({
          color: 'error',
          content: res.data.msg ?? vuetify.locale.t('$vuetify.custom.app.http.err_data_msg'),
        })
      }
      return Promise.resolve(res.data)
    } else {
      return Promise.resolve(res)
    }
  },
  async error => {
    // console.log(i18n.global.t('$vuetify.custom.da.demo'))
    // console.log(vuetify.locale.t('$vuetify.custom.da.demo'), 'vuetify')
    if (error && error.response && error.response.status) {
      let msg
      if (
        error.response.status === 401 &&
        !shouldSkipAuthRefresh(error.config) &&
        getRefreshToken()
      ) {
        try {
          // HTTP 401 优先尝试自动刷新，然后重放原请求。
          refreshPromise ??= refreshAccessToken().finally(() => {
            refreshPromise = null
          })
          const accessToken = await refreshPromise
          const originalConfig = {
            ...error.config,
            _retry: true,
            headers: {
              ...error.config?.headers,
              Authorization: 'Bearer ' + accessToken,
            },
          }
          return service(originalConfig)
        } catch (refreshError) {
          // 刷新失败时打开全局重新登录弹框，不改变当前路由。
          requestRelogin()
          throw refreshError
        }
      }

      if (error.response.status === 401 || error.response.status === 402) {
        // 没有 refresh token 或刷新入口被跳过时，直接要求重新登录。
        requestRelogin()
        throw error
      } else if (error.response.status === 403) {
        msg = vuetify.locale.t('$vuetify.custom.app.http.err_403msg')
      } else if (error.response.status === 400) {
        msg = vuetify.locale.t('$vuetify.custom.app.http.err_other_msg')
      } else if (error.response.status >= 500 && error.response.status < 600) {
        // msg = 'internal server exception...'
        msg = vuetify.locale.t('$vuetify.custom.app.http.err_500msg')
        const data = error.response?.data
        if (data instanceof Blob) {
          try {
            const text = await data.text()
            const result = JSON.parse(text)
            msg = result.msg || vuetify.locale.t('$vuetify.custom.app.http.err_other_msg')
          } catch {
            //
          }
        }
      } else {
        // msg = 'request error, please try again.'
        msg = vuetify.locale.t('$vuetify.custom.app.http.err_other_msg')
      }

      const appStore = useAppStore()
      appStore.openMessage({ content: msg, color: 'error' })
    } else {
      if (error && error.name === 'CanceledError') {
        // AbortController
      } else {
        //   let msg = 'request error, please try again'
        let msg = vuetify.locale.t('$vuetify.custom.app.http.err_other_msg')
        if (error && error.message) {
          const idx = error.message.indexOf('timeout')
          if (idx >= 0) {
            //   msg = 'request timeout, please try again'
            msg = vuetify.locale.t('$vuetify.custom.app.http.err_time_out_msg')
          }
        }

        const appStore = useAppStore()
        appStore.openMessage({ content: msg, color: 'error' })
      }
    }
    // console.log(error, 'response error')
    throw error
  },
)
export default service
