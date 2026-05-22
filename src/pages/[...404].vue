<template>
  <v-responsive :max="24" :min="12">
    <v-app>
      <v-empty-state
        color="red"
        headline="Whoops, 404"
        icon="mdi-alert"
        :text="t('$vuetify.custom.app.err404.text')"
        :title="t('$vuetify.custom.app.err404.title')"
      >
        <div class="d-flex flex-column justify-center align-center">
          <div class="d-flex flex-wrap ga-4">
            <v-btn color="primary" @click="onClickAction">
              {{ t('$vuetify.custom.app.err404.btnText') }}
            </v-btn>
          </div>

          <v-img class="mx-auto mt-8" :src="img404" width="800" />
        </div>
      </v-empty-state>

      <div class="position-absolute d-none d-md-flex align-end ga-2" style="bottom: 8%; left: 10%">
        <v-img height="120" :src="imgF1" width="68" />
        <v-img height="70" :src="imgF1" width="40" />
      </div>

      <v-img
        class="position-absolute d-none d-md-flex"
        height="210"
        :src="imgF2"
        style="bottom: 12%; right: 10%"
        width="98"
      />

      <v-img class="position-absolute bottom-0" :src="img404Bg" width="100%" />
    </v-app>
  </v-responsive>
</template>
<script setup>
  import { useRouter } from 'vue-router'
  import { useLocale } from 'vuetify'
  import img404 from '@/assets/images/404.png'
  import img404Bg from '@/assets/images/err-bg.png'
  import imgF1 from '@/assets/images/f1.png'
  import imgF2 from '@/assets/images/f2.png'
  import { useAppStore } from '@/stores/app'

  definePage({
    name: '404',
    title: '404',
    icon: 'mdi-power-off',
    menu: false,
    order: 0,
    meta: {
      requiresAuth: false,
      isLayout: false,
    },
  })
  const { t } = useLocale()
  const appStore = useAppStore()

  const router = useRouter()

  const onClickAction = () => {
    if (appStore.firstMenuPath) {
      router.replace({ path: appStore.firstMenuPath })
    } else {
      router.replace({ path: '/404' })
    }
  }
</script>
