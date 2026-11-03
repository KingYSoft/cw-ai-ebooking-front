<template>
  <v-app class="login-app">
    <div class="login-page">
      <section class="login-hero" :style="{ backgroundImage: heroBg }">
        <div class="login-hero__overlay" />

        <div class="login-hero__top">
          <div class="login-hero__brand">
            <img alt="SJ Clemenger" class="login-hero__logo" :src="logoSrc" />
          </div>

          <div class="login-hero__status">
            <span class="login-hero__pulse" />
            <span>
              {{ l('operational') }}
              <em>{{ l('operationalStatus') }}</em>
            </span>
          </div>
        </div>

        <div class="login-hero__center">
          <div class="login-hero__intro">
            <div class="login-hero__chip">
              <v-icon color="#7dd3fc" icon="mdi-anchor" size="14" />
              <span>{{ l('heroBadge') }}</span>
            </div>

            <h1 class="login-hero__title">{{ l('heroTitle') }}</h1>
            <p class="login-hero__desc">{{ l('heroDesc') }}</p>
          </div>

          <div class="login-hero__features">
            <div v-for="item in features" :key="item.title" class="login-feature">
              <div class="login-feature__icon">
                <v-icon :color="item.iconColor" :icon="item.icon" size="16" />
              </div>
              <div class="login-feature__title">{{ item.title }}</div>
              <p class="login-feature__desc">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="login-panel">
        <div class="login-panel__top">
          <div class="login-panel__ssl">
            <v-icon color="#0f2c59" icon="mdi-lock-outline" size="14" />
            <span>{{ l('ssl') }}</span>
          </div>

          <div class="login-panel__lang">
            <v-icon color="#94a3b8" icon="mdi-earth" size="14" />
            <v-select
              class="login-panel__lang-field"
              density="compact"
              hide-details
              item-title="title"
              item-value="value"
              :items="langItems"
              menu-icon="mdi-chevron-down"
              :model-value="current"
              variant="outlined"
              @update:model-value="changeAppLanguage"
            />
          </div>
        </div>

        <div class="login-panel__form">
          <div class="login-panel__welcome">
            <div class="login-panel__access">
              <span class="login-panel__access-dot" />
              {{ l('portalAccess') }}
            </div>
            <h2>{{ l('signInTitle') }}</h2>
            <p>{{ l('signInSubtitle') }}</p>
          </div>

          <v-form ref="refLoginForm" class="login-form" @submit.prevent="loginHandle">
            <label class="login-form__label">{{ l('label.email') }}</label>
            <v-text-field
              v-model="email"
              class="login-form__field"
              clearable
              density="comfortable"
              hide-details="auto"
              :placeholder="l('placeholder.email')"
              prepend-inner-icon="mdi-email-outline"
              :rules="emailRules"
              variant="outlined"
            />

            <div class="login-form__password-row">
              <label class="login-form__label">{{ l('label.password') }}</label>
              <a class="login-form__forgot" href="#" @click.prevent>{{ l('forgotPassword') }}</a>
            </div>
            <v-text-field
              v-model="pwd"
              :append-inner-icon="pwdVis ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
              class="login-form__field"
              density="comfortable"
              hide-details="auto"
              :placeholder="l('placeholder.password')"
              prepend-inner-icon="mdi-lock-outline"
              :rules="pwdRules"
              :type="pwdVis ? 'text' : 'password'"
              variant="outlined"
              @click:append-inner="pwdVis = !pwdVis"
            />

            <v-btn
              block
              class="login-form__submit"
              :loading="loading"
              size="large"
              type="submit"
              variant="flat"
            >
              {{ l('submitBtn') }}
              <v-icon end icon="mdi-arrow-right" size="16" />
            </v-btn>
          </v-form>
        </div>

        <div class="login-panel__footer">
          <span>{{ l('copyright') }}</span>
          <div class="login-panel__links">
            <button type="button" @click="supportOpen = true">{{ l('help') }}</button>
            <a href="/privacy" rel="noopener noreferrer" target="_blank">{{ l('p2') }}</a>
            <a href="#" @click.prevent>{{ l('terms') }}</a>
          </div>
        </div>
      </section>
    </div>

    <v-dialog v-model="supportOpen" max-width="440">
      <v-card class="login-support" rounded="xl">
        <div class="login-support__header">
          <div class="login-support__title">
            <v-icon color="#0f2c59" icon="mdi-headset" size="18" />
            <span>{{ l('supportTitle') }}</span>
          </div>
          <v-btn icon="mdi-close" size="small" variant="text" @click="supportOpen = false" />
        </div>
        <v-card-text>
          <p class="login-support__intro">{{ l('supportIntro') }}</p>
          <div class="login-support__box">
            <div class="login-support__row">
              <span>{{ l('supportHotline') }}</span>
              <strong>{{ l('supportHotlineValue') }}</strong>
            </div>
            <div class="login-support__row">
              <span>{{ l('supportDesk') }}</span>
              <strong class="login-support__accent">{{ l('supportDeskValue') }}</strong>
            </div>
            <div class="login-support__row">
              <span>{{ l('supportHours') }}</span>
              <strong>{{ l('supportHoursValue') }}</strong>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="px-6 pb-5">
          <v-btn
            block
            class="login-form__submit"
            variant="flat"
            @click="supportOpen = false"
          >
            {{ l('close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <MessageSnack />
    <PrivacyPolicyDialog v-model:open-value="privacyPolicyValue" />
  </v-app>
</template>

<script setup>
  import { computed, inject, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useLocale } from 'vuetify'
  import { login } from '@/api/login'
  import bgImg from '@/assets/images/login/bg.jpg'
  import logoSrc from '@/assets/images/login/logo.png'
  import { useAppStore } from '@/stores/app'
  import { clearAuthSession, setAuthSession } from '@/utils/authSession'
  import { resolveLoginRedirect } from '@/utils/loginRedirect'

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
  const { t, current } = useLocale()
  const appInit = inject('appInit')
  const changeAppLanguage = inject('changeAppLanguage')

  const l = key => t(`$vuetify.custom.loginPage.${key}`)
  const heroBg = `linear-gradient(to right, rgb(15 44 89 / 0.4), rgb(15 44 89 / 0.15)), url(${bgImg})`

  const langItems = computed(() => [
    { title: l('langEn'), value: 'en' },
    { title: l('langZhHant'), value: 'zhHant' },
    { title: l('langZhHans'), value: 'zhHans' },
    { title: l('langVi'), value: 'vi' },
  ])

  const features = computed(() => [
    {
      icon: 'mdi-calendar-check',
      iconColor: '#fff',
      title: l('feature1Title'),
      desc: l('feature1Desc'),
    },
    {
      icon: 'mdi-compass',
      iconColor: '#7dd3fc',
      title: l('feature2Title'),
      desc: l('feature2Desc'),
    },
    {
      icon: 'mdi-file-document',
      iconColor: '#fff',
      title: l('feature3Title'),
      desc: l('feature3Desc'),
    },
  ])

  const loading = ref(false)
  const email = ref('')
  if (localStorage.getItem('email')) {
    email.value = localStorage.getItem('email')
  }
  const emailRules = ref([
    value => {
      if (value) {
        return true
      }
      return t('$vuetify.custom.loginPage.err.email')
    },
  ])
  const pwd = ref('')
  const pwdRules = ref([
    value => {
      if (value) {
        return true
      }
      return t('$vuetify.custom.loginPage.err.password')
    },
  ])
  const pwdVis = ref(false)
  const refLoginForm = ref(null)
  const supportOpen = ref(false)

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
      clearAuthSession()
      const { data } = await login({
        email: email.value,
        password: pwd.value,
      })
      if (data && data.access_token) {
        setAuthSession(data)
        localStorage.setItem('email', email.value)

        localStorage.removeItem('remind-last-timer')
        await appInit()
        if (appStore.hasUserSession) {
          appStore.skipNextAppConfigFetch()
        }
        const redirect = resolveLoginRedirect(route.query.redirect)
        if (redirect) {
          router.replace(redirect)
        } else if (appStore.firstMenuPath) {
          router.replace({ path: appStore.firstMenuPath })
        } else {
          router.replace({ name: '401' })
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
  .login-app {
    background: #f1f5f9;
  }

  .login-page {
    display: flex;
    min-height: 100dvh;
    width: 100%;
  }

  .login-hero {
    position: relative;
    flex: 0 0 58%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0px 56px 40px;
    color: #fff;
    overflow: hidden;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .login-hero__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgb(10 29 60 / 0.8), transparent 45%, rgb(12 74 110 / 0.3));
    pointer-events: none;
  }

  .login-hero__top,
  .login-hero__center {
    position: relative;
    z-index: 1;
  }

  .login-hero__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 48px;
    padding-bottom: 16px;
  }

  .login-hero__logo {
    width: 200px;
    max-width: 200px;
    display: block;
  }

  .login-hero__status {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    border-radius: 999px;
    background: rgb(15 44 89 / 0.65);
    border: 1px solid rgb(255 255 255 / 0.25);
    color: #e0f2fe;
    font-size: 12px;
    font-weight: 500;
    backdrop-filter: blur(10px);
  }

  .login-hero__status em {
    color: #6ee7b7;
    font-style: normal;
    font-weight: 600;
  }

  .login-hero__pulse {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #10b981;
    animation: login-pulse 2s ease-in-out infinite;
  }

  @keyframes login-pulse {
    0%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.4;
      transform: scale(1.2);
    }
  }

  .login-hero__center {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 32px;
    max-width: 672px;
    padding: 48px 0;
  }

  .login-hero__intro {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .login-hero__chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    width: auto;
    padding: 6px 14px;
    border-radius: 999px;
    background: rgb(255 255 255 / 0.2);
    border: 1px solid rgb(255 255 255 / 0.3);
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    backdrop-filter: blur(12px);
  }

  .login-hero__title {
    margin: 0;
    color: #fff;
    font-size: 48px;
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -0.025em;
    text-shadow: 0 8px 24px rgb(0 0 0 / 0.25);
  }

  .login-hero__desc {
    margin: 0;
    color: #f1f5f9;
    font-size: 16px;
    font-weight: 400;
    line-height: 1.625;
    text-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
  }

  .login-hero__features {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .login-feature {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    border-radius: 16px;
    background: rgb(255 255 255 / 0.85);
    border: 1px solid rgb(255 255 255 / 0.6);
    backdrop-filter: blur(16px);
    box-shadow: 0 10px 24px rgb(15 44 89 / 0.12);
  }

  .login-feature__icon {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    background: #0f2c59;
    color: #fff;
    box-shadow: 0 1px 2px rgb(15 44 89 / 0.2);
  }

  .login-feature__title {
    color: #0f2c59;
    font-size: 12px;
    font-weight: 700;
  }

  .login-feature__desc {
    margin: 0;
    color: #475569;
    font-size: 11px;
    line-height: 1.4;
  }

  .login-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 40px 56px;
    background: #fff;
    border-left: 1px solid #e2e8f0;
  }

  .login-panel__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    min-height: 48px;
    padding-bottom: 16px;
    border-bottom: 1px solid #f1f5f9;
  }

  .login-panel__ssl {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
    font-size: 12px;
    font-weight: 500;
  }

  .login-panel__lang {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .login-panel__lang-field {
    width: 210px;
    flex: none;
  }

  .login-panel__lang-field :deep(.v-input__control) {
    height: 32px;
    min-height: 32px;
  }

  .login-panel__lang-field :deep(.v-field) {
    --v-field-padding-start: 16px;
    --v-field-padding-end: 4px;
    --v-field-input-padding-top: 0;
    --v-field-input-padding-bottom: 0;
    height: 32px;
    min-height: 32px !important;
    background: #f8fafc;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    color: #334155;
  }

  .login-panel__lang-field :deep(.v-field__outline) {
    --v-field-border-opacity: 1;
    color: #e2e8f0;
  }

  .login-panel__lang-field :deep(.v-field--focused .v-field__outline) {
    color: #0f2c59;
  }

  .login-panel__lang-field :deep(.v-field__input) {
    min-height: 32px !important;
    padding: 0 0 0 16px;
    font-size: 12px;
    font-weight: 600;
    line-height: 20px;
  }

  .login-panel__lang-field :deep(.v-select__selection) {
    margin-inline-start: 0;
    padding-left: 2px;
  }

  .login-panel__lang-field :deep(.v-select__selection-text) {
    font-size: 12px;
    font-weight: 600;
    line-height: 20px;
  }

  .login-panel__lang-field :deep(.v-field__append-inner) {
    padding-top: 0;
    align-self: center;
  }

  .login-panel__lang-field :deep(.v-icon) {
    font-size: 16px;
    opacity: 0.7;
  }

  .login-panel__form {
    width: 100%;
    max-width: 448px;
    margin: 32px auto;
  }

  .login-panel__welcome {
    margin-bottom: 32px;
  }

  .login-panel__access {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px 12px;
    border-radius: 999px;
    background: #f0f5fa;
    border: 1px solid #e1ebf5;
    color: #0f2c59;
    font-size: 12px;
    font-weight: 700;
  }

  .login-panel__access-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #0f2c59;
  }

  .login-panel__welcome h2 {
    margin: 12px 0 6px;
    color: #0f172a;
    font-size: 30px;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .login-panel__welcome p {
    color: #64748b;
    font-size: 12px;
  }

  .login-form__label {
    display: block;
    margin-bottom: 6px;
    color: #334155;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .login-form__password-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
  }

  .login-form__forgot {
    color: #0f2c59;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
  }

  .login-form__forgot:hover {
    text-decoration: underline;
  }

  .login-form__field {
    margin-bottom: 4px;
  }

  .login-form__field :deep(.v-field) {
    --v-field-border-opacity: 1;
    background: #f8fafc;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 600;
  }

  .login-form__field :deep(.v-field--focused) {
    background: #fff;
  }

  .login-form__submit {
    margin-top: 20px;
    height: 48px !important;
    background: #0f2c59 !important;
    color: #fff !important;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0;
    text-transform: none;
    border-radius: 12px;
    box-shadow: 0 10px 20px rgb(15 44 89 / 0.2);
  }

  .login-form__submit:hover {
    background: #1e3a8a !important;
  }

  .login-panel__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-top: 20px;
    border-top: 1px solid #f1f5f9;
    color: #94a3b8;
    font-size: 11px;
  }

  .login-panel__links {
    display: flex;
    gap: 16px;
  }

  .login-panel__links a,
  .login-panel__links button {
    padding: 0;
    border: 0;
    background: transparent;
    color: #94a3b8;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
  }

  .login-panel__links a:hover,
  .login-panel__links button:hover {
    color: #0f2c59;
  }

  .login-support__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 12px;
    border-bottom: 1px solid #f1f5f9;
  }

  .login-support__title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #0f2c59;
    font-size: 14px;
    font-weight: 700;
  }

  .login-support__intro {
    color: #475569;
    font-size: 12px;
    margin-bottom: 12px;
  }

  .login-support__box {
    padding: 14px;
    border-radius: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
  }

  .login-support__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 4px 0;
    color: #64748b;
    font-size: 12px;
  }

  .login-support__row strong {
    color: #0f172a;
  }

  .login-support__accent {
    color: #0f2c59 !important;
  }

  @media (max-width: 1100px) {
    .login-page {
      flex-direction: column;
    }

    .login-hero {
      flex: none;
      min-height: 520px;
      padding: 32px;
    }

    .login-hero__title {
      font-size: 32px;
    }

    .login-hero__features {
      grid-template-columns: 1fr;
    }

    .login-panel {
      padding: 32px 24px;
      border-left: 0;
    }
  }
</style>
