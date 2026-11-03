<template>
  <FPageLayout :card-loading="cardLoading" :skeleton-loading="skeletonLoading">
    <LayoutWithToolbar :divider="false" :spacer="true" :title="tabTitle">
      <template #actions>
        <v-btn color="primary" :disabled="cardLoading" size="small" variant="flat" @click.stop="handleSave">
          {{ common('save') }}
        </v-btn>
      </template>
    </LayoutWithToolbar>

    <v-tabs v-model="activedTab" color="primary" density="comfortable">
      <v-tab :value="1">{{ groupEditTab('groupDetail') }}</v-tab>
      <v-tab :value="2">{{ groupEditTab('users') }}</v-tab>
      <v-tab :value="3">{{ groupEditTab('permission') }}</v-tab>
    </v-tabs>

    <v-divider />

    <v-form ref="formRef" class="ref-form-pre" color="background">
      <PagesSystemGroupEdit v-model:input-data="inputData" :actived-tab="activedTab" />
    </v-form>
  </FPageLayout>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { saveGroup } from '@/api/group'
  import FPageLayout from '@/components/FPageLayout.vue'
  import LayoutWithToolbar from '@/components/LayoutWithToolbar.vue'
  import PagesSystemGroupEdit from '@/components/system/PagesSystemGroupEdit.vue'
  import { useSystemPageI18n } from '@/composables/useSystemPageI18n'
  import { useAppStore } from '@/stores/app'

  const { common, groupEdit, groupEditTab } = useSystemPageI18n()

  defineOptions({ name: 'SystemGroupNew' })
  definePage({
    name: 'system_group_new',
    icon: 'mdi-account-multiple-outline',
    menu: false,
    order: 3,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      tabTitle: 'New Group',
    },
  })

  const router = useRouter()
  const appStore = useAppStore()

  const defaultInputData = () => ({
    group_detail: {
      id: 0,
      pk: '',
      code: '',
      desc: '',
      is_admin: 'N',
      is_active: 1,
    },
    users: [],
    permission_names: [],
  })

  const cardLoading = ref(false)
  const skeletonLoading = ref(false)
  const activedTab = ref(1)
  const inputData = ref(defaultInputData())
  const tabTitle = ref(groupEdit('newTitle'))
  const formRef = ref(null)

  const buildPayload = () => ({
    group_detail: inputData.value.group_detail,
    selected_user_pks: inputData.value.users.map(user => user.pk).filter(Boolean),
    permission_names: inputData.value.permission_names,
  })

  const handleValidateErrors = errors => {
    const firstError = errors?.[0]
    const tab = firstError?.id?.includes('@') ? Number(firstError.id.split('@', 1)[0]) : 1
    activedTab.value = Number.isNaN(tab) ? 1 : tab
    appStore.openMessage({
      content: firstError?.errorMessages?.[0] || 'data valid fail.',
      color: 'error',
    })
  }

  const handleSave = async () => {
    const { valid, errors } = await formRef.value?.validate?.()
    if (!valid) {
      handleValidateErrors(errors)
      return
    }

    cardLoading.value = true
    try {
      const { success, data } = await saveGroup(buildPayload())
      if (!success) return

      appStore.openMessage({
        content: 'Group saved successfully',
        color: 'success',
      })

      const savedPk = data?.pk || inputData.value.group_detail.pk
      if (savedPk) {
        await router.replace({
          name: 'system_group_edit-pk',
          params: { pk: savedPk },
          query: { code: inputData.value.group_detail.code },
        })
      }
    } finally {
      cardLoading.value = false
    }
  }
</script>
