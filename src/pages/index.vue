<template>
  <v-sheet :class="'pa-3'" color="transparent"> Dashboard </v-sheet>
</template>

<script setup>
  import { useLayoutCols } from '@/composables/useLayoutCols'

  const { rescols } = useLayoutCols()
  defineOptions({
    name: 'Dashboard',
  })

  definePage({
    name: 'dashboard',
    icon: 'mdi-view-dashboard-outline',
    menu: true,
    order: 0,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
    },
  })
</script>
