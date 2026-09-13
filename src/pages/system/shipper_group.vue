<template>
  <PartyGroupList role="SHIPPER" />
</template>
<script setup>
  import PartyGroupList from '@/components/system/party-group/PartyGroupList.vue'
  definePage({
    name: 'system_shipper_group',
    icon: 'mdi-account-group-outline',
    menu: true,
    order: 7,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      permissions: 'PERMISSION_SYSTEM_PARTY_GROUP',
      tabTitle: 'Shipper Group',
    },
  })
</script>
