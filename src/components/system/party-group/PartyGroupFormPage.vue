<template>
  <FPageLayout :card-loading="busy" :skeleton-loading="skeletonLoading">
    <LayoutWithToolbar
      :title="`${t(props.isEdit ? 'editTitle' : 'newTitle')} — ${group.code || t(group.role_type)}`"
    >
      <template #actions>
        <v-btn
          v-if="canEdit"
          color="primary"
          :disabled="busy"
          size="small"
          variant="flat"
          @click="save"
        >
          {{ t('save') }}
        </v-btn>
      </template>
    </LayoutWithToolbar>

    <v-tabs v-model="activedTab" color="deep-purple-accent-4" density="comfortable">
      <v-tab :value="1">{{ t('detail') }}</v-tab>
      <v-tab :value="2">{{ t('members') }}</v-tab>
      <v-tab :value="3">{{ t('links') }}</v-tab>
    </v-tabs>

    <v-divider />

    <v-form ref="formRef" class="ref-form-pre" :disabled="busy || !canEdit" @submit.prevent="save">
      <v-sheet class="h-100" color="transparent">
        <v-scroll-x-transition hide-on-leave mode="out-in">
          <div v-show="activedTab === 1">
            <PartyGroupDetail v-model:input-data="inputData" :input-data-rules="inputDataRules" />
          </div>
        </v-scroll-x-transition>

        <v-scroll-x-transition hide-on-leave mode="out-in">
          <div v-show="activedTab === 2">
            <PartyGroupCompany
              v-model:input-data="inputData"
              :actived-tab="activedTab"
              :group-pk="groupPk"
              :role-type="roleType"
            />
          </div>
        </v-scroll-x-transition>

        <v-scroll-x-transition hide-on-leave mode="out-in">
          <div v-show="activedTab === 3">
            <PartyGroupRelation
              v-model:input-data="inputData"
              :actived-tab="activedTab"
              :group-pk="groupPk"
              :max-height="maxHeight"
              :role-type="roleType"
            />
          </div>
        </v-scroll-x-transition>
      </v-sheet>
    </v-form>
  </FPageLayout>
</template>
<script setup>
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useDisplay } from 'vuetify'
  import { getPartyGroup, savePartyGroup } from '@/api/party-group'
  import FPageLayout from '@/components/FPageLayout.vue'
  import LayoutWithToolbar from '@/components/LayoutWithToolbar.vue'
  import { PARTY_GROUP_ROLES, validateGroupLinks } from '@/composables/partyGroupChanges'
  import { usePartyGroupI18n } from '@/composables/usePartyGroupI18n'
  import { useUnsavedInputDataGuard } from '@/composables/useUnsavedInputDataGuard'
  import { useAppStore } from '@/stores/app'

  defineOptions({ name: 'PartyGroupFormPage' })

  const props = defineProps({
    pk: { type: String, default: '' },
    isEdit: {
      type: Boolean,
      default: false,
    },
  })
  const { t } = usePartyGroupI18n()
  const route = useRoute()
  const router = useRouter()
  const app = useAppStore()
  const display = useDisplay()
  const roles = PARTY_GROUP_ROLES
  const roleType = roles.includes(String(route.query.role_type))
    ? String(route.query.role_type)
    : 'AGENT'

  const inputData = ref({
    code: '',
    description: '',
    is_active: 1,
    org_header_pks: [],
    org_header_list: [],
    link_list: [],
    role_type: roleType,
  })

  const state = ref({
    group: {
      id: 0,
      pk: '',
      role_type: roleType,
      code: '',
      description: '',
      is_active: 1,
      row_version: null,
    },
    members: [],
    links: [],
  })
  const group = computed({
    get: () => state.value.group,
    set: value => {
      state.value.group = value
    },
  })
  const members = computed({
    get: () => state.value.members,
    set: value => {
      state.value.members = value
    },
  })
  const links = computed({
    get: () => state.value.links,
    set: value => {
      state.value.links = value
    },
  })
  const { markInputDataSaved } = useUnsavedInputDataGuard(state)
  const beforeMembers = ref([])
  const beforeLinks = ref([])
  const canEdit = computed(() => app.auth.isGranted('PERMISSION_SYSTEM_PARTY_GROUP'))

  const busy = ref(false)
  const activedTab = ref(1)
  const memberSearch = ref('')
  const formRef = ref(null)
  const skeletonLoading = ref(true)
  const groupPk = ref('')
  const memberHeaders = computed(() => [
    { title: t('orgCode'), key: 'org_code' },
    { title: t('orgName'), key: 'org_full_name' },
    { title: t('actions'), key: 'actions', sortable: false },
  ])
  const linkHeaders = computed(() => [
    ...roles.map(role => ({ title: t(role), key: `${role.toLowerCase()}_group_code` })),
    { title: t('actions'), key: 'actions', sortable: false },
  ])
  const memberSelection = computed({
    get: () => members.value.map(x => ({ ...x, pk: x.org_header_pk })),
    set: rows => {
      members.value = rows.map(x => ({ ...x, org_header_pk: x.pk }))
    },
  })

  const maxHeight = computed(() => display.height.value - 320)

  async function load() {
    if (!props.pk) {
      skeletonLoading.value = false
      return
    }
    busy.value = true
    try {
      const { success, data } = await getPartyGroup(props.pk)
      skeletonLoading.value = false
      if (success && data?.pk) {
        groupPk.value = data.pk
        inputData.value = data
        markInputDataSaved()
      }
    } catch (error) {
      console.error(error)
    } finally {
      busy.value = false
    }
  }
  async function save() {
    if (busy.value || !canEdit.value) {
      return
    }
    const validation = await formRef.value?.validate()
    if (!validation?.valid) {
      activedTab.value = 1
      return
    }
    const invalid = validateGroupLinks(links.value, group.value.pk)
    if (invalid) {
      app.openMessage({ content: invalid, color: 'error' })
      activedTab.value = 3
      return
    }
    busy.value = true
    try {
      const { success, data } = await savePartyGroup({
        ...inputData.value,
        org_header_pks: (inputData.value.org_header_list ?? []).filter(x => x.pk).map(x => x.pk),
      })
      if (success && data?.pk) {
        markInputDataSaved()
        app.openMessage({ content: t('saved'), color: 'success' })
        if (props.pk) {
          await load()
        } else {
          await router.replace({ name: 'system_party_group_edit-pk', params: { pk: data.pk } })
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      busy.value = false
    }
  }
  watch(() => props.pk, load, { immediate: true })
  const inputDataRules = ref({
    code: [
      value => {
        if (value) return true
        return t('codeRequired')
      },
    ],
  })
</script>
