<template>
  <v-sheet :class="'pa-3'" color="transparent"> Dashboard </v-sheet>
</template>

<script setup>
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
      permissions: 'PERMISSION_DASHBOARD',
    },
  })
</script>
