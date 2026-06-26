<template>
  <v-sheet class="overflow-y-auto" color="transparent" :height="maxDisplayHeight">
    <v-card-text class="pt-2">
      <VTreeview
        v-model:opened="openOneLevel"
        v-model:selected="inputData.permission_names"
        density="comfortable"
        indent-lines
        item-title="display_name"
        item-value="permission_name"
        :items="permissionItems"
        items-registration="props"
        :loading="loading"
        :open-on-click="false"
        select-strategy="branch"
        selectable
        separate-roots
      />
    </v-card-text>
  </v-sheet>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { queryGroupAllPermission } from '@/api/group'

  defineOptions({ name: 'GroupPermission' })
  const props = defineProps({
    maxDisplayHeight: {
      type: Number,
      default: 0,
    },
  })

  const inputData = defineModel('input-data', {
    type: Object,
    default: () => ({}),
  })

  const loading = ref(false)
  const permissionItems = ref([])
  const openOneLevel = ref([])

  const loadPermissions = async () => {
    loading.value = true
    try {
      const { data } = await queryGroupAllPermission()
      permissionItems.value = data?.list ?? []

      const aa = permissionItems.value.length > 0 ? permissionItems.value[0] : null
      openOneLevel.value = aa ? (aa.permission_name ? [aa.permission_name] : []) : []
    } finally {
      loading.value = false
    }
  }

  onMounted(loadPermissions)
</script>
