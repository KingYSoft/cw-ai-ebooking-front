<template>
  <v-sheet class="h-100" color="transparent">
    <v-scroll-x-transition hide-on-leave mode="out-in">
      <div v-show="activedTab === 1">
        <GroupDetail v-model:input-data="inputData" :input-data-rules="inputDataRules" />
      </div>
    </v-scroll-x-transition>

    <v-scroll-x-transition hide-on-leave mode="out-in">
      <div v-show="activedTab === 2">
        <GroupUsers v-model:input-data="inputData" />
      </div>
    </v-scroll-x-transition>

    <v-scroll-x-transition hide-on-leave mode="out-in">
      <div v-show="activedTab === 3">
        <GroupPermission v-model:input-data="inputData" :max-display-height="maxDisplayHeight" />
      </div>
    </v-scroll-x-transition>
  </v-sheet>
</template>

<script setup>
  import { ref, toRefs } from 'vue'
  import GroupDetail from './group/GroupDetail.vue'
  import GroupPermission from './group/GroupPermission.vue'
  import GroupUsers from './group/GroupUsers.vue'
  import { useSystemPageI18n } from '@/composables/useSystemPageI18n'

  const { groupEdit } = useSystemPageI18n()

  const props = defineProps({
    activedTab: {
      type: Number,
      default: 1,
    },
    maxDisplayHeight: {
      type: Number,
      default: 0,
    },
  })

  const { activedTab } = toRefs(props)

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => ({}),
  })

  const inputDataRules = ref({
    code: [
      value => {
        if (value) return true
        return groupEdit('validation.codeRequired')
      },
    ],
  })
</script>
