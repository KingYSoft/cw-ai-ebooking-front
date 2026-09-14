<template>
  <FPageLayout :card-loading="cardLoading" :skeleton-loading="skeletonLoading">
    <v-card-item class="pb-6">
      <v-card-title>{{ security('title') }}</v-card-title>
    </v-card-item>

    <v-card-text>
      <p class="mb-6">{{ security('description') }}</p>
      <v-btn color="primary" @click="openClearCacheDia">{{ security('clearAllCache') }}</v-btn>
    </v-card-text>

    <v-dialog v-model="clearCacheDiaVis" max-width="400" persistent>
      <v-card
        :disabled="cardLoading"
        :loading="cardLoading"
        prepend-icon="mdi-alert-circle"
        :title="security('dialog.title')"
      >
        <template #loader="{ isActive }">
          <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
        </template>

        <v-card-text class="pb-2">{{ security('dialog.message') }}</v-card-text>
        <v-divider />

        <template #actions>
          <v-spacer />

          <v-btn
            size="small"
            :text="t('$vuetify.custom.dialog.btn.cancel')"
            @click="clearCacheDiaVis = false"
          />

          <v-btn
            color="primary"
            size="small"
            :text="t('$vuetify.custom.dialog.btn.ok')"
            variant="flat"
            @click="handleClearCache"
          />
        </template>
      </v-card>
    </v-dialog>
  </FPageLayout>
</template>
<script setup>
  import { appCacheClear } from '@/api/app'
  import { useSystemPageI18n } from '@/composables/useSystemPageI18n'
  import { useAppStore } from '@/stores/app'

  defineOptions({ name: 'SystemSecurity' })

  const { security, t } = useSystemPageI18n()
  const appStore = useAppStore()

  definePage({
    name: 'system_security',
    icon: 'mdi-shield-lock-outline',
    menu: true,
    order: 98,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      permissions: 'PERMISSION_SYSTEM_SECURITY',
    },
  })
  const skeletonLoading = ref(true)
  const cardLoading = ref(false)

  const queryTbl = () => {
    cardLoading.value = true
    setTimeout(() => {
      skeletonLoading.value = false
      cardLoading.value = false
    }, 200)
  }
  queryTbl()

  const clearCacheDiaVis = ref(false)
  const openClearCacheDia = () => {
    clearCacheDiaVis.value = true
  }
  const handleClearCache = async () => {
    cardLoading.value = true
    try {
      const { success } = await appCacheClear()
      if (success) {
        clearCacheDiaVis.value = false
        appStore.openMessage({ content: t('$vuetify.custom.app.saveSuccess'), color: 'success' })
        queryTbl()
      }
    } catch (error) {
      console.log(error)
    } finally {
      cardLoading.value = false
    }
  }
</script>
