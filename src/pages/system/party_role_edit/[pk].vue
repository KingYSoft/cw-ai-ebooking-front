<template>
  <PartyRoleFormPage :key="pk" :pk="pk" />
</template>

<script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import PartyRoleFormPage from '@/components/system/party-role/PartyRoleFormPage.vue'

  defineOptions({ name: 'SystemPartyRoleEdit' })
  definePage({
    name: 'system_party_role_edit-pk',
    icon: 'mdi-account-switch-outline',
    menu: false,
    order: 3,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      permissions: 'PERMISSION_SYSTEM_PARTY_ROLE11',
      tabTitle: 'Party Role-{code}',
    },
  })

  const route = useRoute()
  const pk = computed(() => route.params.pk?.toString() || '')
</script>
