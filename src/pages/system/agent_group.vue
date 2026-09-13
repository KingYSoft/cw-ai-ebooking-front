<template>
  <PartyGroupList role="AGENT" />
</template>
<script setup>
  import PartyGroupList from '@/components/system/party-group/PartyGroupList.vue'
  definePage({
    name: 'system_agent_group',
    icon: 'mdi-account-group-outline',
    menu: true,
    order: 5,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      permissions: 'PERMISSION_SYSTEM_PARTY_GROUP',
      tabTitle: 'Agent Group',
    },
  })
</script>
