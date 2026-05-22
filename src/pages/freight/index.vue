<template>
  <div>{{ t('$vuetify.custom.menuPage.freight') }}</div>
</template>

<script setup>
  import { useLocale } from 'vuetify'

  defineOptions({ name: 'Freight' })
  definePage({
    name: 'freight',
    icon: 'mdi-truck-cargo-container',
    menu: true,
    order: 1,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
    },
  })

  const { t } = useLocale()
</script>
