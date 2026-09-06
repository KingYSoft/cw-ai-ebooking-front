<template>
  <div>{{ t('$vuetify.custom.menuPage.warehouse') }}</div>
</template>

<script setup>
  import { useLocale } from 'vuetify'

  defineOptions({ name: 'Warehouse' })
  definePage({
    name: 'warehouse',
    icon: 'mdi-warehouse',
    menu: true,
    order: 2,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      permissions: 'PERMISSION_WAREHOUSE',
    },
  })

  const { t } = useLocale()
</script>
