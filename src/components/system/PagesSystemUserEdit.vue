<template>
  <v-sheet class="h-100" color="transparent">
    <v-scroll-x-transition hide-on-leave mode="out-in">
      <div v-show="activedTab === 1">
        <UserDetail
          ref="userDetailRef"
          v-model:input-data="inputData"
          :input-data-rules="inputDataRules"
          :is-edit="isEdit"
        />
      </div>
    </v-scroll-x-transition>

    <v-scroll-x-transition hide-on-leave mode="out-in">
      <div v-show="activedTab === 2">
        <UserWarehouse v-model:input-data="inputData" :actived-tab="activedTab" />
      </div>
    </v-scroll-x-transition>

    <div
      v-for="(role, index) in ['AGENT', 'CONSIGNEE', 'SHIPPER']"
      v-show="activedTab === index + 3"
      :key="role"
    >
      <UserPartyGroups v-model:input-data="inputData" :actived-tab="activedTab" :role="role" />
    </div>
  </v-sheet>
</template>

<script setup>
  import { ref, toRefs } from 'vue'
  import { useSystemPageI18n } from '@/composables/useSystemPageI18n'
  import UserDetail from './user/UserDetail.vue'
  import UserPartyGroups from './user/UserPartyGroups.vue'
  import UserWarehouse from './user/UserWarehouse.vue'

  const { userEdit } = useSystemPageI18n()

  const props = defineProps({
    activedTab: {
      type: Number,
      default: 1,
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  })

  defineEmits([])

  const { activedTab, isEdit } = toRefs(props)

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => ({}),
  })

  const inputDataRules = ref({
    login_name: [
      value => {
        if (value) return true
        return userEdit('validation.loginNameRequired')
      },
    ],
    password_hash: [
      value => {
        if (value) return true
        return userEdit('validation.passwordRequired')
      },
    ],
    org_header: [
      value => {
        if (value) return true
        return userEdit('validation.orgHeaderRequired')
      },
    ],
  })
</script>
