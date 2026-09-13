<template><PartyGroupFormPage :is-edit="false" /></template>
<script setup>
  import PartyGroupFormPage from '@/components/system/party-group/PartyGroupFormPage.vue'
  definePage({
    name: 'system_party_group_new',
    menu: false,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      permissions: 'PERMISSION_SYSTEM_PARTY_GROUP',
      tabTitle: 'New Group',
    },
  })
</script>
