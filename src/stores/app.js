// Utilities
import { defineStore } from 'pinia'
import { nextTick } from 'vue'
import { routes } from 'vue-router/auto-routes'
import { appAllConfig } from '@/api/app'
import { userChangeSetting } from '@/api/user'
import vuetify from '@/plugins/vuetify'
import { getAccessToken } from '@/utils/authSession'

let fetchAppConfigPromise = null
let fetchAppConfigPromiseToken = null

export const useAppStore = defineStore('app', {
  state: () => ({
    appAlive: false,
    appLoading: false,
    globalLoading: false,
    globalLoadingText: 'Loading...',
    globalLoadingIcon: '$vuetify-outline',
    globalLoadingColor: 'primary',
    configLoading: false,
    messageOpen: false,
    messageOptions: {
      content: '',
      color: '',
      timeout: 3000,
    },
    privacyDiaOpen: true,
    config: {
      auth: { allPermissions: {}, grantedPermissions: {} },
      localization: {
        currentCulture: {},
        currentLanguage: {},
        languages: [],
        sources: [],
        values: {},
      },
      setting: {
        values: {},
      },
      custom: {
        isAuthenticated: false,
      },
    },
    defaultSourceName: '',
    appMenus: [],
    allMenus: [],
    _callbacks: {},
    // 按 tab value 保存各页面的 inputData 未保存检查函数。
    unsavedInputDataGuards: {},
    // 全局未保存提示弹框状态，由 layout 统一渲染。
    unsavedInputDataDialogOpen: false,
    // 用户点击“好”后执行的强制关闭或强制跳转动作。
    unsavedInputDataConfirmAction: null,
    // 强制关闭或跳转时跳过下一次路由未保存检查，避免再次拦截。
    skipUnsavedInputDataOnce: false,
    // 登录成功后已经刷新过配置，跳过紧随其后的路由守卫配置请求。
    skipNextAppConfigFetchOnce: false,
    // 登录失效时由 axios 拦截器打开，全局弹框完成重新登录。
    reloginDialogOpen: false,
  }),
  getters: {
    /**
     * event
     * @param {*} state
     * @returns
     */
    event: state => {
      return {
        /**
         * 注册事件
         */
        on: (eventName, callback) => {
          const _callbacks = state._callbacks
          if (!_callbacks[eventName]) {
            _callbacks[eventName] = []
          }

          _callbacks[eventName].push(callback)
        },
        /**
         * 销毁事件
         */
        off: (eventName, callback) => {
          const _callbacks = state._callbacks
          const callbacks = _callbacks[eventName]
          if (!callbacks) {
            return
          }
          let idx = -1
          for (let i = 0; i < callbacks.length; i++) {
            if (callbacks[i] === callback) {
              idx = i
              break
            }
          }

          if (idx < 0) {
            return
          }
          state._callbacks[eventName].splice(idx, 1)
          console.log(state._callbacks)
        },
        /**
         * 触发事件
         */
        trigger: (eventName, ...args) => {
          const _callbacks = state._callbacks
          const callbacks = _callbacks[eventName]
          if (!callbacks || callbacks.length === 0) {
            return
          }
          for (let i = 0; i < callbacks.length; i++) {
            const fn = callbacks[i]
            fn.apply(state.event, args)
          }
        },
      }
    },
    utils: state => {
      return {
        /**
         * formatString('Hello {0}','Tuana') = 'Hello Tuana'
         * @param {String} str
         * @param  {...any} args
         * @returns
         */
        formatString: (str, ...args) => {
          if (str) {
            if (args && args.length > 0) {
              for (let i = 0; i < args.length; i++) {
                const placeHolder = '{' + i + '}'
                str = state.utils.replaceAll(str, placeHolder, args[i])
              }
              return str
            } else {
              return str
            }
          } else {
            return ''
          }
        },
        /**
         * replaceAll('This is a test string', 'is', 'X') = 'ThX X a test string'
         * @param {String} str
         * @param {String} search
         * @param {String} replacement
         * @returns
         */
        replaceAll: (str, search, replacement) => {
          const fix = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          return str.replace(new RegExp(fix, 'g'), replacement)
        },
        /**
         * 检查是否是函数
         * @param {Function} func
         * @returns
         */
        isFunction(func) {
          return !!(func && func.constructor && func.call && func.apply)
        },
        /**
         * 验证时间，HH:mm
         * @param {*} timeStr
         * @returns
         */
        isValidTime(timeStr) {
          // /^[1-9]{1}[0-9]{3}-(0[1-9]{1}|1[0-2]{1})-(0[1-9]{1}|[1-2]{1}[0-9]{1}|3[0-5]{1})T([0-1]{1}[0-9]{1}|2[0-3]{1}):[0-5]{1}[0-9]{1}$/
          return /^([01]\d|2[0-3]):[0-5]\d$/.test(timeStr)
        },
        /**
         * 验证日期 yyyy-MM-dd
         * @param {*} dateStr
         * @returns
         */
        isValidDate(dateStr) {
          if (!/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[0-5])$/.test(dateStr)) {
            return false
          }
          const [year, month, day] = dateStr.split('-').map(a => Number(a))
          const date = new Date(year, month - 1, day)
          if (Number.isNaN(date.getTime())) {
            return false
          } else {
            return (
              date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
            )
          }
        },
        addDays(date, days) {
          const result = new Date(date)
          result.setDate(result.getDate() + days)
          return result
        },
        addMinutes(date, mi) {
          const result = new Date(date)
          result.setMinutes(result.getMinutes() + mi)
          return result
        },
        addMonth(date, m) {
          const result = new Date(date)
          result.setMonth(result.getMonth() + m)
          return result
        },
        addYear(date, y) {
          const result = new Date(date)
          result.setFullYear(result.getFullYear() + y)
          return result
        },
        /**
         * 格式化日期，yyyy-MM-dd
         * @param {*} date
         * @returns
         */
        formatDate(date) {
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从 0 开始，需要加 1
          const day = String(date.getDate()).padStart(2, '0')
          return year + '-' + month + '-' + day
        },
        /**
         * 格式化时间，yyyy-MM-dd HH:mm
         * @param {*} date
         * @returns
         */
        formatTime(date) {
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0') // 月份从 0 开始，需要加 1
          const day = String(date.getDate()).padStart(2, '0')
          const hour = String(date.getHours()).padStart(2, '0')
          const minute = String(date.getMinutes()).padStart(2, '0')
          return year + '-' + month + '-' + day + ' ' + hour + ':' + minute
        },
        /**
         * 格式化 UTC
         * formatUTCTime('2026-03-28T10:00:00Z', 'yyyy-MM-dd HH:mm')
         * 输出：2026-03-28 18:00
         */
        formatUTCTime(utcStr, fmt = 'yyyy-MM-dd HH:mm:ss') {
          if (!utcStr) {
            return ''
          }

          const date = new Date(utcStr)
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          const hours = String(date.getHours()).padStart(2, '0')
          const minutes = String(date.getMinutes()).padStart(2, '0')
          const seconds = String(date.getSeconds()).padStart(2, '0')
          const ms = String(date.getMilliseconds())

          // 根据格式返回对应时间
          return fmt
            .replace('yyyy', year)
            .replace('MM', month)
            .replace('dd', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds)
            .replace('ms', ms)
        },
        /**
         * 随机整数
         * @param {*} min
         * @param {*} max
         * @returns
         */
        getRandomNum(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min
        },

        /**
         * 9位整数，或者小数点后5位的数字
         * @param {* Number} value
         * @returns
         */
        testFloat(str) {
          if (str === '0' || str === 0) {
            return true
          } else if (/^[1-9]\d{0,8}$/.test(str)) {
            return true
          } else if (/^0\.\d{1,5}$/.test(str)) {
            return true
          } else if (/^[1-9]\d{0,8}\.\d{1,5}$/.test(str)) {
            return true
          }
          return false
        },
        /**
         * 9位整数
         * @param {*} str
         * @returns
         */
        testInt(str) {
          if (str === '0' || str === 0) {
            return true
          } else if (/^[1-9]\d{0,8}$/.test(str)) {
            return true
          }
          return false
        },
      }
    },
    auth: state => {
      return {
        /**
         * 是否授权
         * @param {string} permissionName 权限名称
         * @returns
         */
        isGranted: permissionName => {
          if (
            (state.config.auth.grantedPermissions[permissionName] ?? '').toLowerCase() === 'true'
          ) {
            return true
          } else {
            if (
              (
                JSON.parse(sessionStorage.getItem('auth') ?? '{}')[permissionName] ?? ''
              ).toLowerCase() === 'true'
            ) {
              return true
            } else {
              return false
            }
          }
        },
      }
    },
    firstMenuPath: state => {
      if (state.appMenus && state.appMenus.length > 0) {
        const aaa = item => {
          if (item.children && item.children.length > 0) {
            return aaa(item.children[0])
          } else {
            return item.path
          }
        }
        return aaa(state.appMenus[0])
      } else {
        return null
      }
    },
    nickName: state => {
      console.log(state.appAlive)
      const name = localStorage.getItem('nick_name')
      const email = localStorage.getItem('email')
      return name ?? (email ? email.split('@', 1)[0] : '')
    },
    emailAddress: state => {
      console.log(state.appAlive)
      const email = localStorage.getItem('email')
      return email
    },
    appCombobox: state => {
      return {
        /**
         * 获取下拉框数据
         * @param {String} key
         * @returns
         */
        getCombobox: key => {
          if (state.config.custom && state.config.custom.appComboboxConfig) {
            return state.config.custom.appComboboxConfig[key] ?? []
          } else {
            return []
          }
        },
      }
    },
    hasUserSession(state) {
      return state.config.custom && Boolean(state.config.custom.isAuthenticated)
    },
    userSession: state => {
      return {
        /**
         * 获取下拉框数据
         * @param {String} key
         * @returns
         */
        session: () => {
          if (state.config.custom && state.config.custom.userSession) {
            return { ...state.config.custom.userSession }
          } else {
            return {}
          }
        },
        currentCompanyPK: () => {
          if (state.config.custom && state.config.custom.userSession) {
            return state.config.custom.userSession.company_pk
          }
        },
        currentBranchPK: () => {
          if (state.config.custom && state.config.custom.userSession) {
            return state.config.custom.userSession.branch_pk
          }
        },
        /**
         * login_name or email_address First code
         */
        nameInitials: () => {
          if (state.config.custom && state.config.custom.userSession) {
            const nn =
              state.config.custom.userSession.login_name ??
              state.config.custom.userSession.email_address
            if (nn) {
              return nn.charAt(0).toUpperCase()
            }
          }
        },
      }
    },
    useSettings: state => {
      return {
        get: name => {
          if (state.config.setting && state.config.setting.values) {
            return state.config.setting.values[name]
          } else {
            return null
          }
        },
        getMenuFav: () => {
          const aa = state.useSettings.get('MENU_FAV')
          if (aa) {
            const parsed = JSON.parse(aa)
            if (Array.isArray(parsed)) {
              return parsed
            }
          }
          return []
        },
        checkMenuFav: name => {
          const arr = state.useSettings.getMenuFav()
          return arr.some(a => a === name)
        },
      }
    },
    isHeadOffice: state => {
      if (state.config.custom && state.config.custom.session) {
        return state.config.custom.session.isHeadOffice === 1
      } else {
        return false
      }
    },
    env: state => {
      console.log(state.messageOpen)
      return {
        isUAT() {
          return import.meta.env.VITE_APP_LOCATION === 'uat'
        },
        isPRD() {
          return import.meta.env.VITE_APP_LOCATION === 'prd'
        },
        isSIT() {
          return import.meta.env.VITE_APP_LOCATION === 'sit'
        },
        isDemoLogiSofts() {
          return import.meta.env.VITE_APP_LOCATION === 'demo_logisofts'
        },
      }
    },
  },
  actions: {
    /**
     * 打开消息框
     */
    openMessage(options) {
      this.closeMessage()
      nextTick(() => {
        setTimeout(() => {
          this.messageOpen = true
          this.messageOptions = { ...options }
        }, 150)
      })
    },
    /**
     * 关闭消息框
     */
    closeMessage() {
      this.messageOpen = false
    },
    openGlobalLoading(text = 'Loading...') {
      this.globalLoadingText = text || 'Loading...'
      if (!this.globalLoading) {
        this.globalLoading = true
      }
    },
    openGlobalLoadingWithIcon(text = 'Loading...', icon, color) {
      this.globalLoadingText = text || 'Loading...'
      if (icon) {
        this.globalLoadingIcon = icon
      }
      if (color) {
        this.globalLoadingColor = color
      }
      if (!this.globalLoading) {
        this.globalLoading = true
      }
    },
    closeGlobalLoading() {
      this.globalLoading = false
    },
    // 打开全局重新登录弹框，保持当前页面不跳转。
    openReloginDialog() {
      this.reloginDialogOpen = true
    },
    // 重新登录成功后关闭弹框。
    closeReloginDialog() {
      this.reloginDialogOpen = false
    },
    // 页面挂载时注册对应 tab 的未保存检查器。
    registerUnsavedInputDataGuard(tabValue, checker) {
      if (!tabValue || typeof checker !== 'function') {
        return
      }
      this.unsavedInputDataGuards[tabValue] = checker
    },
    // 页面卸载或 tab value 变化时移除旧检查器。
    unregisterUnsavedInputDataGuard(tabValue) {
      if (!tabValue) {
        return
      }
      delete this.unsavedInputDataGuards[tabValue]
    },
    // 根据 tab value 判断页面 inputData 是否有未保存变化。
    hasUnsavedInputData(tabValue) {
      const checker = this.unsavedInputDataGuards[tabValue]
      if (typeof checker !== 'function') {
        return false
      }
      try {
        return checker()
      } catch (error) {
        console.error('Failed to check unsaved inputData:', error)
        return false
      }
    },
    // 路由和 tab 共用同一套 value 规则，动态页面使用 routeName-pk。
    getRouteTabValue(route) {
      const routeName = route?.name?.toString?.() || ''
      const pk = route?.params?.pk?.toString?.()
      return pk ? `${routeName}-${pk}` : routeName
    },
    // 路由跳转前通过 from route 快速定位当前 tab 的未保存状态。
    hasUnsavedInputDataByRoute(route) {
      const tabValue = this.getRouteTabValue(route)
      return this.hasUnsavedInputData(tabValue)
    },
    // 打开未保存提示弹框，并记录确认后的后续动作。
    openUnsavedInputDataDialog(confirmAction = null) {
      this.unsavedInputDataConfirmAction =
        typeof confirmAction === 'function' ? confirmAction : null
      this.unsavedInputDataDialogOpen = true
    },
    // 点击取消只关闭弹框，不执行关闭 tab 或跳转动作。
    closeUnsavedInputDataDialog() {
      this.unsavedInputDataDialogOpen = false
      this.unsavedInputDataConfirmAction = null
    },
    // 点击好执行已保存的强制动作，例如关闭当前 tab 或继续跳转。
    confirmUnsavedInputDataDialog() {
      const confirmAction = this.unsavedInputDataConfirmAction
      this.unsavedInputDataDialogOpen = false
      this.unsavedInputDataConfirmAction = null
      if (typeof confirmAction === 'function') {
        confirmAction()
      }
    },
    // 强制动作会触发 router.push，先标记跳过下一次未保存检查。
    skipNextUnsavedInputDataCheck() {
      this.skipUnsavedInputDataOnce = true
    },
    // 路由守卫消费一次性跳过标记，消费后立即恢复拦截能力。
    consumeSkipUnsavedInputDataCheck() {
      if (!this.skipUnsavedInputDataOnce) {
        return false
      }
      this.skipUnsavedInputDataOnce = false
      return true
    },
    // 登录成功后会先刷新配置，随后路由跳转只需要消费一次这个标记。
    skipNextAppConfigFetch() {
      this.skipNextAppConfigFetchOnce = true
    },
    consumeSkipNextAppConfigFetch() {
      if (!this.skipNextAppConfigFetchOnce) {
        return false
      }
      this.skipNextAppConfigFetchOnce = false
      return true
    },
    setAppConfig(data) {
      if (data) {
        const custom = {
          ...data.custom,
          isAuthenticated: Boolean(data.custom.isAuthenticated),
        }

        this.config = { ...data, custom }
        if (custom.defaultSourceName) {
          this.defaultSourceName = custom.defaultSourceName
        }
        // if (data.auth && data.auth.grantedPermissions) {
        //   sessionStorage.setItem('auth', JSON.stringify(data.auth.grantedPermissions))
        // } else {
        //   sessionStorage.setItem('auth', '{}')
        // }
      }
    },
    setAppMenus(menus, allMenus) {
      this.appMenus = menus ?? []
      this.allMenus = allMenus ?? []
    },
    setSession(sessionData) {
      if (sessionData) {
        if (!this.config.custom) {
          this.config.custom = {}
        }
        this.config.custom.session = sessionData
      }
    },
    /**
     * 本地化
     * @param {String} key
     * @param {String} sourceName
     * @param {...any} args
     * @returns
     */
    localize(key, sourceName, ...args) {
      const resName = sourceName ?? this.defaultSourceName

      const source = this.config.localization.values[resName]

      if (!source) {
        console.warn('Could not find localization source: ' + resName)
        return key
      }

      const value = source[key]
      if (value) {
        return this.utils.formatString(value, ...args)
      } else {
        return key
      }
    },
    /**
     * 获取app config
     * @param {*} callback
     */
    async fetchAppConfig(callback) {
      const currentToken = getAccessToken()
      const excludeName = this.env.isUAT() || this.env.isPRD() ? ['po_management', 'bi'] : []

      if (!fetchAppConfigPromise || fetchAppConfigPromiseToken !== currentToken) {
        const requestToken = currentToken
        const requestPromise = (async () => {
          const { data } = await appAllConfig()
          // const { data } = await AppService.getAppAllConfig()
          if (data && getAccessToken() === requestToken) {
            const allMenus = []
            /**
             * 根据 权限 生成 菜单
             * @param {*} items
             * @param {*} parentPath
             * @returns
             */
            const getMenus = items => {
              const newMenus = []
              items.forEach(v => {
                if (v.name && (v.children ?? []).length <= 0) {
                  if (v.menu === true) {
                    const r = {
                      code: v.name,
                      title: vuetify.locale.t(`$vuetify.custom.menuPage.` + v.name),
                      icon: v.icon,
                      order: v.order ?? 99,
                      path: v.path,
                      children: [],
                    }
                    let pass = true
                    if (v.meta && v.meta.permissions) {
                      pass = this.auth.isGranted(v.meta.permissions)
                    }
                    if (excludeName.includes(v.name)) {
                      pass = false
                    }
                    if (pass) {
                      newMenus.push(r)
                      allMenus.push(r)
                    }
                  }
                } else {
                  // 父级
                  const v0 = v.children ? v.children[0] : null
                  if (v0) {
                    // 子集的一个的path，如果是空这表示，是父级的信息
                    if (v0.path) {
                      // 文件夹下必须要有 index.vue
                    } else {
                      if (v0.menu === true) {
                        const myPath = v.path.indexOf('/') === 0 ? v.path : '/' + v.path
                        const p = {
                          code: v0.name,
                          title: vuetify.locale.t(`$vuetify.custom.menuPage.` + v0.name),
                          order: v0.order ?? 99,
                          icon: v0.icon,
                          path: myPath,
                          children: [],
                        }
                        let pass = true
                        if (v0.meta && v0.meta.permissions) {
                          pass = this.auth.isGranted(v0.meta.permissions)
                        }
                        if (excludeName.includes(v0.name)) {
                          pass = false
                        }
                        if (pass) {
                          if (v.children) {
                            const newChild = []
                            for (let i = 0; i < v.children.length; i++) {
                              const el = v.children[i]
                              if (el.path) {
                                const c = {
                                  ...el,
                                  path: p.path + '/' + el.path,
                                }
                                newChild.push(c)
                              }
                            }
                            if (newChild.length > 0) {
                              p.children = getMenus(newChild)
                            }
                          }
                          newMenus.push(p)
                        }
                      }
                    }
                  }
                }
              })
              // 排序
              if (newMenus.length > 0) {
                const aa = newMenus.map(item => item).sort((a, b) => a.order - b.order)
                return aa
              } else {
                return []
              }
            }

            this.setAppConfig({
              ...data,
              custom: data.custom,
            })
            const appMenus = getMenus(routes)
            this.setAppMenus(appMenus, allMenus)
          }
          return data
        })()
          .catch(error => {
            console.log(error)
            return null
          })
          .finally(() => {
            if (fetchAppConfigPromise === requestPromise) {
              fetchAppConfigPromise = null
              fetchAppConfigPromiseToken = null
            }
          })
        fetchAppConfigPromise = requestPromise
        fetchAppConfigPromiseToken = requestToken
      }

      const data = await fetchAppConfigPromise
      if (data && callback && this.utils.isFunction(callback)) {
        callback(data)
      }
      return data
    },

    async toggleMenuFav(name) {
      const fff = this.useSettings.getMenuFav()
      const idx = fff.findIndex(a => a === name)
      if (idx >= 0) {
        fff.splice(idx, 1)
      } else {
        if (fff.length < 10) {
          fff.splice(0, 0, name)
        } else {
          const len = fff.length - 1
          fff.splice(len, 1)
          fff.splice(0, 0, name)
        }
      }
      const vv = JSON.stringify(fff)
      this.config.setting.values['MENU_FAV'] = vv
      try {
        const { success } = await userChangeSetting({
          setting_name: 'MENU_FAV',
          setting_value: vv,
        })
        if (success) {
          this.openMessage({
            content: vuetify.locale.t('$vuetify.custom.app.saveSuccess'),
            color: 'success',
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
})
