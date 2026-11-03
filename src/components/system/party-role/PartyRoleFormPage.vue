<template>
  <FPageLayout :card-loading="busy" :show-divider="false" :skeleton-loading="loading">
    <LayoutWithToolbar ref="refLayoutWithToolbar" :divider="false" :spacer="true" :title="tabTitle">
      <template #actions>
        <v-btn
          color="primary"
          :disabled="!detailLoaded || busy"
          :loading="saving"
          size="small"
          variant="flat"
          @click="handleSave"
        >
          {{ t('save') }}
        </v-btn>
      </template>
    </LayoutWithToolbar>

    <v-tabs v-model="activedTab" color="primary" density="comfortable">
      <v-tab :value="1">Detail</v-tab>
      <v-tab :value="2">Party Role</v-tab>
    </v-tabs>

    <v-divider />

    <v-form
      ref="formRef"
      class="ref-form-pre"
      :disabled="busy || !detailLoaded"
      @submit.prevent="handleSave"
    >
      <v-sheet class="h-100" color="transparent">
        <v-scroll-x-transition hide-on-leave mode="out-in">
          <div v-show="activedTab === 1">
            <PartyRoleDetail v-model:input-data="inputData" :input-data-rules="inputDataRules" />
          </div>
        </v-scroll-x-transition>

        <v-scroll-x-transition hide-on-leave mode="out-in">
          <div v-show="activedTab === 2">
            <PartyRelationsTable
              v-model:relations="inputData.relations"
              :disabled="busy"
              :max-display-height="maxHeight"
            />
          </div>
        </v-scroll-x-transition>
      </v-sheet>
    </v-form>
  </FPageLayout>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useDisplay } from 'vuetify'
  import { getPartyRoleById, savePartyRole } from '@/api/party-role'
  import FPageLayout from '@/components/FPageLayout.vue'
  import LayoutWithToolbar from '@/components/LayoutWithToolbar.vue'
  import { buildRelationChanges } from '@/composables/partyRoleRelations.js'
  import { usePartyRoleI18n } from '@/composables/usePartyRoleI18n'
  import { useUnsavedInputDataGuard } from '@/composables/useUnsavedInputDataGuard'
  import { useAppStore } from '@/stores/app'
  import PartyRelationsTable from './PartyRelationsTable.vue'

  const props = defineProps({ pk: { type: String, default: '' } })
  const { t } = usePartyRoleI18n()
  const router = useRouter()
  const appStore = useAppStore()
  const route = useRoute()
  const display = useDisplay()

  const inputData = ref({
    role_detail: { code: '', description: '', is_active: 1 },
    relations: [],
  })
  const originalRelations = ref([])
  const detailLoaded = ref(!props.pk)
  const loading = ref(false)
  const saving = ref(false)
  const busy = computed(() => loading.value || saving.value)

  const contentHeight = computed(() => display.height.value - 65 - 35)
  const refLayoutWithToolbar = ref(null)
  const maxHeight = computed(() => {
    return contentHeight.value - (refLayoutWithToolbar.value?.$el?.clientHeight ?? 0) - 12 - 52 - 14
  })

  const activedTab = ref(1)
  const formRef = ref(null)
  const { markInputDataSaved } = useUnsavedInputDataGuard(inputData)

  const tabTitle = computed(() => {
    const tabTitleTemplate = route.meta.tabTitle || 'Edit Party Role'
    return tabTitleTemplate.replace('{code}', inputData.value.role_detail.code || '')
  })

  const loadDetail = async pk => {
    detailLoaded.value = false
    loading.value = true
    try {
      const { success, data } = await getPartyRoleById(pk)
      if (!success) throw new Error('Detail request failed')
      if (!data?.role_detail?.pk) {
        return false
      }
      // A missing relation list is not an empty role: never use it as a deletion baseline.
      if (!Array.isArray(data.relations)) throw new Error('Missing relations')
      inputData.value = {
        role_detail: { ...data.role_detail },
        relations: data.relations.map(relation => ({ ...relation })),
      }
      originalRelations.value = data.relations.map(relation => ({ ...relation }))
      detailLoaded.value = true
      markInputDataSaved()
      return true
    } catch (error) {
      console.error(error)
      return false
    } finally {
      loading.value = false
    }
  }

  const handleSave = async () => {
    if (busy.value || !detailLoaded.value) return
    saving.value = true
    try {
      inputData.value.role_detail.code = inputData.value.role_detail.code?.trim() || ''
      const validation = await formRef.value?.validate()
      if (!validation?.valid) {
        activedTab.value = 1
        return
      }
      const { success, data } = await savePartyRole({
        role_detail: { ...inputData.value.role_detail },
        ...buildRelationChanges(originalRelations.value, inputData.value.relations),
      })
      if (!success) throw new Error('Save request failed')

      // The write succeeded. Block resubmission until persisted relation PKs are reloaded.
      detailLoaded.value = false
      markInputDataSaved()
      const savedPk = data?.pk || data?.role_detail?.pk || inputData.value.role_detail.pk
      if (!savedPk) {
        loadError.value = t('loadFailed')
        return
      }
      appStore.openMessage({ content: t('saved'), color: 'success' })
      if (props.pk) {
        await loadDetail(savedPk)
      } else {
        // The edit page loads the saved detail, including generated relation PKs.
        await router.replace({
          name: 'system_party_role_edit-pk',
          params: { pk: savedPk },
          query: { code: inputData.value.role_detail.code },
        })
      }
    } catch {
      appStore.openMessage({ content: t('saveFailed'), color: 'error' })
    } finally {
      saving.value = false
    }
  }

  if (props.pk) loadDetail(props.pk)

  const inputDataRules = ref({
    code: [
      value => {
        if (value) return true
        return t('codeRequired')
      },
    ],
  })
</script>
