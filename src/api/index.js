import axios from 'axios'
// import i18n from '@/plugins/vuei18n'
import vuetify from '@/plugins/vuetify'
import router from '@/router'
import { useAppStore } from '@/stores/app'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 45 * 1000,
})
service.interceptors.request.use(
  config => {
    // const cookieLangValue = 'zh-Hans' // getCookieValue('Localization.CultureName')
    const lang = localStorage.getItem('lang')
    const cookieLangValue = lang ? (lang === 'zhHans' ? 'zh-Hans' : lang) : 'en'
    const token = sessionStorage.getItem('token')
    config.headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
      'Facade-Language': `c=${cookieLangValue}|uic=${cookieLangValue}`,
      ...config.headers,
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
  error => {
    // console.log(i18n.global.t('$vuetify.custom.da.demo'))
    // console.log(vuetify.locale.t('$vuetify.custom.da.demo'), 'vuetify')
    if (error && error.response && error.response.status) {
      let msg
      if (
        error.response.status === 400 ||
        error.response.status === 401 ||
        error.response.status === 402 ||
        error.response.status === 403
      ) {
        router.replace({
          name: 'login',
        })
        // msg = 'login is invalid, please login again.'
        msg = vuetify.locale.t('$vuetify.custom.app.http.err_401msg')
        if (error.response.status === 403) {
          msg = vuetify.locale.t('$vuetify.custom.app.http.err_403msg')
        }
        sessionStorage.clear()
      } else if (error.response.status >= 500 && error.response.status < 600) {
        // msg = 'internal server exception...'
        msg = vuetify.locale.t('$vuetify.custom.app.http.err_500msg')
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
    return Promise.reject(error)
  },
)
export default service
