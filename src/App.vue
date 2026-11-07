<template>
  <router-view v-if="appStore.appAlive" v-slot="{ Component }">
    <v-fade-transition mode="out-in">
      <component :is="Component" />
    </v-fade-transition>
  </router-view>

  <template v-else>
    <!-- 未加载页面时的弹框 -->
    <FLoadingDialog :dia-vis="!appStore.appAlive" :title="t('$vuetify.custom.app.loading')" />
    <MessageSnack />
  </template>
  <!-- 重新登录弹框挂在 App 根节点，任何页面收到 401 都能直接弹出。 -->
  <GlobalReloginDialog />
</template>

<script setup>
  import { nextTick, onMounted, provide, ref } from 'vue'
  import { useLocale, useTheme } from 'vuetify'

  // import i18n from '@/plugins/vuei18n'
  // console.log(i18n.global.d(new Date('2024-11-23T07:56'), 'short'), 'xxxxxxxxxxxxxxxxxxxxxx')

  import { useAppStore } from '@/stores/app'
  import { useUserStore } from '@/stores/user'
  import { getFacadeLanguageCulture, getHtmlLang } from '@/utils/locale'

  const appStore = useAppStore()
  const userStore = useUserStore()

  const { current, t } = useLocale()
  const theme = useTheme()

  const appThemeIcon = ref('light')

  const appInit = async () => {
    // 关闭错误弹框
    appStore.closeMessage()
    // 设置语言
    if (localStorage.getItem('lang')) {
      const lang = localStorage.getItem('lang')
      current.value = lang
      if (appStore.env.isPRD() || appStore.env.isSIT() || appStore.env.isUAT()) {
        document.title = t('$vuetify.custom.app.title')
      }
      document.documentElement.lang = getHtmlLang(lang)
      localStorage.setItem('lang', lang)
    } else {
      // 默认 en
      current.value = 'en'
      if (appStore.env.isPRD() || appStore.env.isSIT() || appStore.env.isUAT()) {
        document.title = t('$vuetify.custom.app.title')
      }
      document.documentElement.lang = 'en'
      localStorage.setItem('lang', 'en')
    }
    userStore.changeSetting(
      'Abp.Localization.DefaultLanguageName',
      getFacadeLanguageCulture(current.value),
    )

    // 设置主题
    const tTheme = localStorage.getItem('theme')
    if (tTheme) {
      if (tTheme === 'light' || tTheme === 'dark') {
        theme.change(tTheme)
        appThemeIcon.value = tTheme
      }
    }

    // // 设置当前时区
    // const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    // userStore.changeSetting('Abp.Timing.TimeZone', timeZone)

    // 设置当前时区
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    console.log(timeZone, 'timeZone')
    userStore.changeSetting(
      'Abp.Timing.TimeZone',
      timeZone ? (timeZone === 'UTC' ? 'Etc/UTC' : timeZone) : 'Etc/UTC',
    )

    // // callback
    // if (callback && appStore.utils.isFunction(callback)) {
    //   callback()
    // }
    appStore.appAlive = false
    const data = await appStore.fetchAppConfig()
    await new Promise(resolve => setTimeout(resolve, 10))
    await nextTick()
    appStore.appAlive = true

    return data
  }

  const reload = () => {
    // appInit(() => {
    //   appStore.fetchAppConfig(() => {
    //     appStore.appAlive = false
    //     setTimeout(() => {
    //       nextTick(() => {
    //         appStore.appAlive = true
    //       })
    //     }, 10)
    //   })
    // })
    appInit()
  }
  // 注入
  provide('reload', reload)

  /**
   * 1.app 初始化（F5刷新）
   * 2.reload router-view reload
   * 需要加载配置文件
   */
  appInit()

  // 注入
  provide('appInit', appInit)
  // 切换语言
  const changeAppLanguage = lang => {
    localStorage.setItem('lang', lang)
    reload()
  }
  // 注入
  provide('changeAppLanguage', changeAppLanguage)

  // 切换主题
  const changeAppTheme = () => {
    if (theme.global.current.value.dark) {
      theme.change('light')
      appThemeIcon.value = 'light'
      localStorage.setItem('theme', 'light')
    } else {
      theme.change('dark')
      appThemeIcon.value = 'dark'
      localStorage.setItem('theme', 'dark')
    }
  }
  // 注入
  provide('appThemeIcon', appThemeIcon)
  provide('changeAppTheme', changeAppTheme)

  onMounted(() => {})
</script>
