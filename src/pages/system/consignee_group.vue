<template>
  <PartyGroupList role="CONSIGNEE" />
</template>
<script setup>
  import PartyGroupList from '@/components/system/party-group/PartyGroupList.vue'
  definePage({
    name: 'system_consignee_group',
    icon: 'mdi-account-group-outline',
    menu: true,
    order: 6,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      permissions: 'PERMISSION_SYSTEM_PARTY_GROUP',
      tabTitle: 'Consignee Group',
    },
  })
</script>
