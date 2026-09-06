<template>
  <div>{{ t(`$vuetify.custom.menuPage.po_management`) }}</div>
</template>
<script setup>
  import { useLocale } from 'vuetify'

  defineOptions({ name: 'PoManagement' })
  definePage({
    name: 'po_management',
    icon: 'mdi-tune',
    menu: true,
    order: 3,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      permissions: 'PERMISSION_PO_MANAGEMENT',
    },
  })
  const { t } = useLocale()
</script>
