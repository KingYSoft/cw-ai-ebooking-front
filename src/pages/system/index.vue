<template>
  <div>{{ t(`$vuetify.custom.menuPage.system`) }}</div>
</template>
<script setup>
  import { useLocale } from 'vuetify'

  defineOptions({ name: 'System' })
  definePage({
    name: 'system',
    icon: 'mdi-application-cog',
    menu: true,
    order: 99,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      //   permissions: 'PERMISSION_SYSTEM',
    },
  })
  const { t } = useLocale()
</script>
