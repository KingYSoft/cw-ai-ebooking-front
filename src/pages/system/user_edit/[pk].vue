<template>
  <FPageLayout :card-loading="cardLoading" :skeleton-loading="skeletonLoading">
    <LayoutWithToolbar :divider="false" :spacer="true" :title="tabTitle">
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

    <v-tabs v-model="activedTab" color="deep-purple-accent-4" density="comfortable">
      <v-tab :value="1">{{ userEditTab('detail') }}</v-tab>
      <v-tab :value="2">{{ userEditTab('warehouse') }}</v-tab>
    </v-tabs>

    <v-divider />

    <v-form ref="formRef" class="ref-form-pre" color="background">
      <PagesSystemUserEdit
        v-model:input-data="inputData"
        :actived-tab="activedTab"
        :is-edit="true"
      />
    </v-form>

    <v-dialog v-model="userEmptyVis" max-width="400" persistent>
      <v-card
        :disabled="cardLoading"
        :loading="cardLoading"
        prepend-icon="mdi-alert-circle"
        :title="userDialog('notExists', 'title')"
      >
        <template #loader="{ isActive }">
          <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
        </template>

        <v-card-text class="pb-2">
          {{ userDialog('notExists', 'message') }}
        </v-card-text>

        <template #actions>
          <v-spacer />

          <v-btn
            color="primary"
            :text="userDialog('notExists', 'newUser')"
            variant="tonal"
            @click="newUserHandle"
          />
        </template>
      </v-card>
    </v-dialog>
  </FPageLayout>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { getUserById, saveUser } from '@/api/user'
  import FPageLayout from '@/components/FPageLayout.vue'
  import LayoutWithToolbar from '@/components/LayoutWithToolbar.vue'
  import PagesSystemUserEdit from '@/components/system/PagesSystemUserEdit.vue'
  import { useSystemPageI18n } from '@/composables/useSystemPageI18n'
  import { useAppStore } from '@/stores/app'

  const { common, userDialog, userEditTab } = useSystemPageI18n()

  defineOptions({ name: 'SystemUserEdit' })
  definePage({
    name: 'system_user_edit-pk',
    icon: 'mdi-account',
    menu: false,
    order: 2,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      tabTitle: 'USER-{login_name}',
    },
  })

  const route = useRoute()
  const appStore = useAppStore()

  const defaultInputData = () => ({
    id: 0,
    pk: '',
    login_name: '',
    full_name: '',
    email_address: '',
    mobile_phone: '',
    can_login: 1,
    is_admin: 0,
    is_active: 1,
    warehouse_list: [],
  })

  const cardLoading = ref(false)
  const skeletonLoading = ref(true)
  const activedTab = ref(1)
  const userEmptyVis = ref(false)
  const inputData = ref(defaultInputData())

  const tabTitle = computed(() => {
    const tabTitleTemplate = route.meta.tabTitle || 'Edit User'
    const loginName = inputData.value.login_name || ''
    return tabTitleTemplate.replace('{login_name}', loginName)
  })

  const formRef = ref(null)

  const handleSave = async () => {
    const { valid, errors } = await formRef.value?.validate?.()
    if (valid) {
      cardLoading.value = true
      try {
        const { success, data } = await saveUser(inputData.value)
        if (!success) {
          return
        }

        if (data) {
          inputData.value = {
            ...inputData.value,
            ...data,
          }
        }

        appStore.openMessage({
          content: 'User saved successfully',
          color: 'success',
        })

        loadData()
      } catch (error) {
        console.error('Save user failed:', error)
      } finally {
        cardLoading.value = false
      }
    } else {
      let errList = []
      if (errors && errors.length > 0) {
        const err = []
        for (let i = 0; i < errors.length; i++) {
          const e = errors[i]
          const msg =
            e.errorMessages && e.errorMessages.length > 0 ? e.errorMessages[0] : 'data valid fail.'

          if (e.id.indexOf('@') >= 0) {
            const tab = e.id.split('@')[0]
            if (!Number.isNaN(Number(tab)) && Number(tab) > 0) {
              err.push({ tab: Number(tab), msg })
            }
          } else {
            err.push({ tab: 1, msg })
          }
        }
        if (err.length > 0) {
          errList = err.map(item => item).sort((a, b) => a.tab - b.tab)
        }
      }
      if (errList.length > 0) {
        activedTab.value = errList[0].tab
        appStore.openMessage({
          content: errList[0].msg,
          color: 'error',
        })
      } else {
        appStore.openMessage({
          content: 'data valid fail.',
          color: 'error',
        })
      }
    }
  }

  const pk = ref(null)
  const loadData = async () => {
    pk.value = route.params.pk?.toString()
    cardLoading.value = true
    try {
      const { success, data } = await getUserById(pk.value)
      skeletonLoading.value = false
      if (success && data) {
        inputData.value = {
          ...defaultInputData(),
          ...data,
        }
        userEmptyVis.value = false
      } else {
        inputData.value = defaultInputData()
        userEmptyVis.value = true
      }
    } catch (error) {
      console.error('Query user failed:', error)
      skeletonLoading.value = false
      userEmptyVis.value = true
    } finally {
      cardLoading.value = false
    }
  }

  const newUserHandle = () => {
    userEmptyVis.value = false
    window.location.href = '/system/user_new'
  }

  loadData()
</script>
