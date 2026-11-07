<template>
  <!-- 全局重新登录弹框：登录失效时覆盖当前页面，不跳转到 login 路由。 -->
  <v-dialog v-model="appStore.reloginDialogOpen" max-width="600" persistent>
    <v-card :disabled="loading" :loading="loading">
      <template #loader="{ isActive }">
        <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
      </template>

      <v-toolbar color="primary">
        <v-card-title class="text-h5">
          {{
            appStore.env.isDemoLogiSofts()
              ? 'LogiSofts Booking Portal'
              : t('$vuetify.custom.app.title')
          }}
        </v-card-title>
      </v-toolbar>

      <v-card-text>
        <v-sheet class="ma-auto my-0" color="transparent" max-width="200">
          <v-img
            v-if="appStore.env.isDemoLogiSofts()"
            :lazy-src="logiSoftslogoSrc"
            :src="logiSoftslogoSrc"
          />

          <v-img v-else :lazy-src="logoSrc" :src="logoSrc" />
        </v-sheet>

        <v-card-title class="px-0 pb-4 text-subtitle-1">
          {{ t('$vuetify.custom.loginPage.title') }}
        </v-card-title>

        <v-form ref="refLoginForm" @submit.prevent="loginHandle">
          <v-text-field
            v-model="email"
            clearable
            color="primary"
            :label="t('$vuetify.custom.loginPage.label.email')"
            :placeholder="t('$vuetify.custom.loginPage.placeholder.email')"
            :rules="emailRules"
            variant="outlined"
          />

          <v-text-field
            v-model="pwd"
            :append-inner-icon="pwdVis ? 'mdi-eye-off' : 'mdi-eye'"
            class="mt-4"
            color="primary"
            :label="t('$vuetify.custom.loginPage.label.password')"
            :placeholder="t('$vuetify.custom.loginPage.placeholder.password')"
            :rules="pwdRules"
            :type="pwdVis ? 'text' : 'password'"
            variant="outlined"
            @click:append-inner="pwdVis = !pwdVis"
          />

          <v-btn block class="mt-4" color="primary" size="x-large" type="submit" variant="flat">
            {{ t('$vuetify.custom.loginPage.submitBtn') }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useLocale } from 'vuetify'
  import { login } from '@/api/login'
  import logiSoftslogoSrc from '@/assets/images/login/logisofts_logo.png'
  import logoSrc from '@/assets/images/login/logo.png'
  import { useAppStore } from '@/stores/app'
  import { clearAuthSession, setAuthSession } from '@/utils/authSession'

  const appStore = useAppStore()
  const { t } = useLocale()

  const loading = ref(false)
  const email = ref('')
  const pwd = ref('')
  const pwdVis = ref(false)
  const refLoginForm = ref(null)

  const emailRules = ref([
    value => {
      if (value) return true
      return t('$vuetify.custom.loginPage.err.email')
    },
  ])
  const pwdRules = ref([
    value => {
      if (value) return true
      return t('$vuetify.custom.loginPage.err.password')
    },
  ])

  watch(
    () => appStore.reloginDialogOpen,
    value => {
      if (value) {
        // 弹框打开时预填最近登录邮箱，并清空密码。
        email.value = localStorage.getItem('email') || ''
        pwd.value = ''
      }
    },
  )

  const loginHandle = async () => {
    if (!refLoginForm.value) {
      return
    }

    const { valid } = await refLoginForm.value.validate()
    if (!valid) {
      return
    }

    loading.value = true
    try {
      // 重新登录前清掉旧 token，避免登录请求或后续请求继续带旧认证信息。
      clearAuthSession()
      const { data, msg, success } = await login({
        email: email.value,
        password: pwd.value,
      })

      if (success && data?.access_token) {
        // 登录成功后写入新 token，刷新权限菜单，并通知 SignalR 使用新 token 重连。
        setAuthSession(data)
        localStorage.setItem('email', email.value)
        appStore.closeReloginDialog()
        await appStore.fetchAppConfig()
        appStore.event.trigger('auth.tokenRefreshed')
      } else {
        appStore.openMessage({
          content: msg ?? t('$vuetify.custom.app.http.err_401msg'),
          color: 'error',
        })
      }
    } catch (error) {
      appStore.openMessage({
        content: error?.message ?? t('$vuetify.custom.app.http.err_401msg'),
        color: 'error',
      })
    } finally {
      loading.value = false
    }
  }
</script>
