<template>
  <PartyRoleFormPage />
</template>

<script setup>
  import PartyRoleFormPage from '@/components/system/party-role/PartyRoleFormPage.vue'

  defineOptions({ name: 'SystemPartyRoleNew' })
  definePage({
    name: 'system_party_role_new',
    icon: 'mdi-account-switch-outline',
    menu: false,
    order: 3,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      permissions: 'PERMISSION_SYSTEM_PARTY_ROLE',
      tabTitle: 'New Party Role',
    },
  })
</script>
