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
  </v-sheet>
</template>

<script setup>
  import { ref, toRefs } from 'vue'
  import UserDetail from './user/UserDetail.vue'
  import UserWarehouse from './user/UserWarehouse.vue'

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

  const emit = defineEmits([])

  const { activedTab, isEdit } = toRefs(props)

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => ({}),
  })

  const inputDataRules = ref({
    login_name: [
      value => {
        if (value) return true
        return 'Login Name is required.'
      },
    ],
    password_hash: [
      value => {
        if (value) return true
        return 'Password is required.'
      },
    ],
    org_header: [
      value => {
        if (value) return true
        return 'Org Header is required.'
      },
    ],
  })
</script>
