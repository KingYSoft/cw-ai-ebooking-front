<template><PartyGroupFormPage is-edit :pk="String(route.params.pk)" /></template>
<script setup>
  import { useRoute } from 'vue-router'
  import PartyGroupFormPage from '@/components/system/party-group/PartyGroupFormPage.vue'
  const route = useRoute()
  definePage({
    name: 'system_party_group_edit-pk',
    menu: false,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      permissions: 'PERMISSION_SYSTEM_PARTY_GROUP',
      tabTitle: 'Edit Group',
    },
  })
</script>
