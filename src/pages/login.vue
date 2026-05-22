<template>
  <v-responsive>
    <v-row no-gutters>
      <v-col :cols="rescols('c12m5')">
        <v-img cover height="100%" :lazy-src="bgImg" :src="bgImg" />
      </v-col>

      <v-col :cols="rescols('c12m7')">
        <v-app>
          <v-app-bar color="transparent" :elevation="0">
            <template #append>
              <v-menu>
                <template #activator="{ props }">
                  <v-btn v-bind="props" :disabled="loading" icon="mdi-translate" />
                </template>

                <v-list activatable min-width="120">
                  <v-list-item @click="changeAppLanguage('en')">English</v-list-item>
                  <v-list-item @click="changeAppLanguage('zhHans')">中文简体</v-list-item>
                  <v-list-item @click="changeAppLanguage('zhHant')">中文繁體</v-list-item>
                  <v-list-item @click="changeAppLanguage('vi')">Tiếng Việt</v-list-item>
                </v-list>
              </v-menu>

              <v-btn
                :disabled="loading"
                :icon="appThemeIcon === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
                @click="changeAppTheme()"
              />
            </template>
          </v-app-bar>

          <v-main class="d-flex flex-column">
            <v-sheet color="transparent">
              <div class="w-100 pa-4">
                <v-sheet class="ma-auto my-10" color="transparent" max-width="300">
                  <v-img :lazy-src="logoSrc" :src="logoSrc" />
                </v-sheet>

                <v-card class="ma-auto" :disabled="loading" :loading="loading" max-width="600">
                  <template #loader="{ isActive }">
                    <v-progress-linear
                      :active="isActive"
                      color="deep-purple"
                      height="4"
                      indeterminate
                    />
                  </template>

                  <v-toolbar color="primary">
                    <v-card-title class="text-h5">
                      {{ t('$vuetify.custom.app.title') }}
                    </v-card-title>
                  </v-toolbar>

                  <v-card-title class="py-4 text-subtitle-1">
                    {{ t('$vuetify.custom.loginPage.title') }}
                  </v-card-title>

                  <v-card-text>
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

                      <v-row no-gutters>
                        <v-spacer />

                        <v-col class="d-flex justify-end" :cols="rescols('c6')">
                          <!-- <v-btn
                            class="text-none"
                            color="primary"
                            :ripple="false"
                            slim
                            text
                            variant="text"
                          >
                            {{ t('$vuetify.custom.loginPage.forgotPassword') }}
                          </v-btn> -->
                          <a
                            class="text-decoration-none text-primary"
                            href="#"
                            rel="noopener noreferrer"
                          >
                            {{ t('$vuetify.custom.loginPage.forgotPassword') }}
                          </a>
                        </v-col>
                      </v-row>

                      <v-btn
                        block
                        class="mt-4"
                        color="primary"
                        size="x-large"
                        type="submit"
                        variant="flat"
                      >
                        {{ t('$vuetify.custom.loginPage.submitBtn') }}
                      </v-btn>
                    </v-form>
                  </v-card-text>
                  <!-- <v-card-text class="d-flex justify-center align-baseline">
                    <span class="text-none">{{ t('$vuetify.custom.loginPage.newMessage') }}</span>
                    <v-btn
                      class="pa-0 ml-2 text-none"
                      color="primary"
                      height="auto"
                      :ripple="false"
                      variant="text"
                    >
                      {{ t('$vuetify.custom.loginPage.newBtn') }}
                    </v-btn>
                  </v-card-text> -->
                  <v-card-text class="px-5 d-flex justify-center align-baseline">
                    <span class="text-caption">
                      {{ t('$vuetify.custom.loginPage.p1') }}
                      <a
                        class="text-primary"
                        href="/privacy"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {{ t('$vuetify.custom.loginPage.p2') }}
                      </a>
                    </span>
                  </v-card-text>
                </v-card>
              </div>
            </v-sheet>

            <v-spacer />
            <app-footer />
          </v-main>
        </v-app>
      </v-col>
    </v-row>

    <MessageSnack />
    <PrivacyPolicyDialog v-model:open-value="privacyPolicyValue" />
  </v-responsive>
</template>

<script setup>
  import { inject, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useLocale } from 'vuetify'
  import { login } from '@/api/login'
  import bgImg from '@/assets/images/login/bg.jpg'
  import logoSrc from '@/assets/images/login/logo.png'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import { useAppStore } from '@/stores/app'

  const { rescols } = useLayoutCols()

  definePage({
    name: 'login',
    icon: 'mdi-login',
    menu: false,
    order: 1,
    meta: {
      requiresAuth: false,
      isLayout: false,
    },
  })

  const router = useRouter()
  const route = useRoute()
  const appStore = useAppStore()
  const { t } = useLocale()

  //   const reload = inject('reload')
  const appInit = inject('appInit')
  // appInit()
  const changeAppLanguage = inject('changeAppLanguage')
  const appThemeIcon = inject('appThemeIcon')
  const changeAppTheme = inject('changeAppTheme')

  const loading = ref(false)
  const email = ref('')
  if (localStorage.getItem('email')) {
    email.value = localStorage.getItem('email')
  }
  const emailRules = ref([
    value => {
      //   if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/.test(value)) return true
      if (value) return true
      return t('$vuetify.custom.loginPage.err.email')
    },
  ])
  const pwd = ref('')
  const pwdRules = ref([
    value => {
      if (value) return true
      return t('$vuetify.custom.loginPage.err.password')
    },
  ])
  const pwdVis = ref(false)
  const refLoginForm = ref(null)
  const loginHandle = async () => {
    if (refLoginForm.value) {
      const { valid } = await refLoginForm.value.validate()
      if (valid) {
        await loginRealHandle()
      }
    }
  }

  const loginRealHandle = async () => {
    loading.value = true
    try {
      const { data } = await login({
        email: email.value,
        password: pwd.value,
      })
      if (data && data.access_token) {
        sessionStorage.setItem('token', data.access_token)
        localStorage.setItem('email', email.value)

        localStorage.removeItem('remind-last-timer')
        appInit()
        const redirect = route.query.redirect
        if (redirect) {
          router.replace({ path: redirect })
        } else {
          if (appStore.firstMenuPath) {
            router.replace({ path: appStore.firstMenuPath })
          } else {
            router.replace({ path: '/404' })
          }
        }
      }
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      loading.value = false
    }
  }
  const privacyPolicyValue = ref(false)
  if (localStorage.getItem('privacy_policy_accepted') !== '1') {
    privacyPolicyValue.value = true
  }
</script>

<style scoped lang="scss">
  // .login-container {
  //   height: 100vh;
  //   padding: 0;
  //   margin: 0;
  //   max-width: 100%;
  // }

  // .fill-height {
  //   height: 100%;
  // }

  // // Hero Section
  // .hero-section {
  //   background-image: url('@/assets/login/bg.jpg');
  //   background-size: cover;
  //   background-position: center;
  //   background-repeat: no-repeat;
  //   position: relative;
  //   display: flex;
  //   align-items: flex-end;
  //   padding: 60px;

  //   &::before {
  //     content: '';
  //     position: absolute;
  //     top: 0;
  //     left: 0;
  //     right: 0;
  //     bottom: 0;
  //     background: linear-gradient(to bottom, rgba(0, 51, 153, 0.1) 0%, rgba(0, 51, 153, 0.4) 100%);
  //   }
  // }

  // .hero-content {
  //   position: relative;
  //   z-index: 1;
  //   color: white;
  //   max-width: 600px;
  // }

  // .hero-text {
  //   margin-bottom: 32px;
  // }

  // .subtitle-small {
  //   font-size: 12px;
  //   font-weight: 600;
  //   letter-spacing: 2px;
  //   text-transform: uppercase;
  //   margin-bottom: 16px;
  //   opacity: 0.9;
  // }

  // .hero-title {
  //   font-size: 48px;
  //   font-weight: 700;
  //   line-height: 1.2;
  //   margin-bottom: 16px;
  //   text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  // }

  // .hero-description {
  //   font-size: 16px;
  //   font-weight: 400;
  //   opacity: 0.9;
  //   margin-bottom: 8px;
  // }

  // .signup-btn {
  //   background: linear-gradient(135deg, #5ba3d0 0%, #4a90c2 100%) !important;
  //   color: white !important;
  //   text-transform: none !important;
  //   font-weight: 500 !important;
  //   padding: 0 28px !important;
  //   height: 48px !important;
  //   font-size: 15px !important;
  //   border-radius: 24px !important;

  //   &:hover {
  //     background: linear-gradient(135deg, #6ab3e0 0%, #5aa0d2 100%) !important;
  //   }
  // }

  // // Login Section
  // .login-section {
  //   background-color: #ffffff;
  //   display: flex;
  //   align-items: center;
  //   justify-content: center;
  //   padding: 40px;
  // }

  // .login-content {
  //   width: 100%;
  //   max-width: 360px;
  //   display: flex;
  //   flex-direction: column;
  //   align-items: center;
  // }

  // .brand-container {
  //   display: flex;
  //   flex-direction: column;
  //   align-items: center;
  //   margin-bottom: 40px;
  // }

  // .logo-img {
  //   margin-bottom: 16px;
  // }

  // .brand-name {
  //   color: #000099;
  //   font-size: 28px;
  //   font-weight: 700;
  //   letter-spacing: -0.5px;
  // }

  // .login-form {
  //   width: 100%;
  //   margin-bottom: 60px;
  // }

  // .form-field {
  //   margin-bottom: 16px;

  //   :deep(.v-field) {
  //     border-radius: 8px;
  //   }

  //   :deep(.v-field__outline) {
  //     --v-field-border-opacity: 0.4;
  //   }

  //   :deep(.v-field__input) {
  //     font-size: 14px;
  //     padding: 12px 16px;
  //   }
  // }

  // .form-actions {
  //   display: flex;
  //   align-items: center;
  //   justify-content: space-between;
  //   margin-top: 8px;
  // }

  // .forgot-password {
  //   color: #1976d2;
  //   font-size: 14px;
  //   text-decoration: none;
  //   font-weight: 500;

  //   &:hover {
  //     text-decoration: underline;
  //   }
  // }

  // .login-btn {
  //   background-color: #000066 !important;
  //   color: white !important;
  //   min-width: 56px !important;
  //   width: 56px !important;
  //   height: 48px !important;
  //   border-radius: 8px !important;

  //   &:hover {
  //     background-color: #000080 !important;
  //   }

  //   :deep(.v-btn__content) {
  //     font-size: 20px;
  //   }
  // }

  // .copyright {
  //   color: #9e9e9e;
  //   font-size: 12px;
  //   text-align: center;
  // }

  // // Responsive Adjustments
  // @media (max-width: 960px) {
  //   .hero-section {
  //     min-height: 50vh;
  //     padding: 40px 24px;
  //   }

  //   .hero-title {
  //     font-size: 32px;
  //   }

  //   .login-section {
  //     min-height: 50vh;
  //     padding: 40px 24px;
  //   }
  // }

  // @media (max-width: 600px) {
  //   .hero-title {
  //     font-size: 28px;
  //   }

  //   .signup-btn {
  //     font-size: 14px !important;
  //     padding: 0 20px !important;
  //   }

  //   .brand-name {
  //     font-size: 24px;
  //   }
  // }
</style>
