<template>
  <FPageLayout :card-loading="cardLoading" :skeleton-loading="skeletonLoading">
    <LayoutWithToolbar ref="refLayoutWithToolbar" :divider="false" :spacer="true" :title="tabTitle">
      <template #actions>
        <v-btn
          color="primary"
          :disabled="cardLoading"
          size="small"
          variant="flat"
          @click.stop="handleSave"
        >
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
      <PagesSystemGroupEdit
        v-model:input-data="inputData"
        :actived-tab="activedTab"
        :max-display-height="maxHeight"
      />
    </v-form>

    <v-dialog v-model="groupEmptyVis" max-width="400" persistent>
      <v-card
        :disabled="cardLoading"
        :loading="cardLoading"
        prepend-icon="mdi-alert-circle"
        :title="groupDialog('notExists', 'title')"
      >
        <template #loader="{ isActive }">
          <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
        </template>

        <v-card-text class="pb-2">{{ groupDialog('notExists', 'message') }}</v-card-text>

        <template #actions>
          <v-spacer />

          <v-btn
            color="primary"
            :text="groupDialog('notExists', 'newGroup')"
            variant="tonal"
            @click="newGroupHandle"
          />
        </template>
      </v-card>
    </v-dialog>
  </FPageLayout>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useDisplay } from 'vuetify'
  import { getGroupById, saveGroup } from '@/api/group'
  import FPageLayout from '@/components/FPageLayout.vue'
  import LayoutWithToolbar from '@/components/LayoutWithToolbar.vue'
  import PagesSystemGroupEdit from '@/components/system/PagesSystemGroupEdit.vue'
  import { useSystemPageI18n } from '@/composables/useSystemPageI18n'
  import { useAppStore } from '@/stores/app'

  const { common, groupDialog, groupEditTab } = useSystemPageI18n()

  defineOptions({ name: 'SystemGroupEdit' })
  definePage({
    name: 'system_group_edit-pk',
    icon: 'mdi-account-multiple-outline',
    menu: false,
    order: 3,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      tabTitle: 'GROUP-{code}',
    },
  })

  const route = useRoute()
  const router = useRouter()
  const appStore = useAppStore()
  const display = useDisplay()

  const contentHeight = computed(() => display.height.value - 65 - 35)
  const refLayoutWithToolbar = ref(null)
  const maxHeight = computed(() => {
    return contentHeight.value - (refLayoutWithToolbar.value?.$el?.clientHeight ?? 0) - 12 - 52 - 14
  })

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
  const skeletonLoading = ref(true)
  const activedTab = ref(1)
  const groupEmptyVis = ref(false)
  const inputData = ref(defaultInputData())
  const formRef = ref(null)

  const tabTitle = computed(() => {
    const tabTitleTemplate = route.meta.tabTitle || 'Edit Group'
    return tabTitleTemplate.replace('{code}', inputData.value.group_detail.code || '')
  })

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

  const loadData = async () => {
    cardLoading.value = true
    try {
      const { success, data } = await getGroupById(route.params.pk?.toString())
      skeletonLoading.value = false
      if (success && data) {
        inputData.value = {
          group_detail: {
            ...defaultInputData().group_detail,
            ...data.group_detail,
          },
          users: data.users ?? [],
          permission_names: data.permission_names ?? [],
        }
        groupEmptyVis.value = false
      } else {
        inputData.value = defaultInputData()
        groupEmptyVis.value = true
      }
    } catch {
      skeletonLoading.value = false
      groupEmptyVis.value = true
    } finally {
      cardLoading.value = false
    }
  }

  const handleSave = async () => {
    const { valid, errors } = await formRef.value?.validate?.()
    if (!valid) {
      handleValidateErrors(errors)
      return
    }

    cardLoading.value = true
    try {
      const { success } = await saveGroup(buildPayload())
      if (!success) return
      appStore.openMessage({
        content: 'Group saved successfully',
        color: 'success',
      })
      await loadData()
    } finally {
      cardLoading.value = false
    }
  }

  const newGroupHandle = () => {
    router.push({ name: 'system_group_new' })
  }

  loadData()
</script>
