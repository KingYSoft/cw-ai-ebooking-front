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
          Save
        </v-btn>
      </template>
    </LayoutWithToolbar>

    <v-tabs v-model="activedTab" color="deep-purple-accent-4" density="comfortable">
      <v-tab :value="1">Detail</v-tab>
      <v-tab :value="2">Warehouse</v-tab>
    </v-tabs>

    <v-divider />

    <v-form ref="formRef" class="ref-form-pre" color="background">
      <PagesSystemUserEdit v-model:input-data="inputData" :actived-tab="activedTab" />
    </v-form>
  </FPageLayout>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { saveUser } from '@/api/user'
  import FPageLayout from '@/components/FPageLayout.vue'
  import LayoutWithToolbar from '@/components/LayoutWithToolbar.vue'
  import PagesSystemUserEdit from '@/components/system/PagesSystemUserEdit.vue'
  import { useAppStore } from '@/stores/app'

  defineOptions({ name: 'SystemUserNew' })
  definePage({
    name: 'system_user_new',
    icon: 'mdi-account',
    menu: false,
    order: 2,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      tabTitle: 'New User',
    },
  })

  const route = useRoute()
  const router = useRouter()
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
  const inputData = ref(defaultInputData())

  const tabTitle = ref('New User')

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

        const savedPk = data?.pk || inputData.value.pk
        const loginName = data?.login_name || inputData.value.login_name

        if (savedPk) {
          await router.replace({
            name: 'system_user_edit-pk',
            params: { pk: savedPk },
            query: {
              login_name: loginName,
            },
          })
        }
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

  const loadData = () => {
    setTimeout(() => {
      inputData.value = defaultInputData()
      skeletonLoading.value = false
    }, 100)
  }

  loadData()
</script>
