<!-- <template>
  <div class="pa-4">
    <v-alert class="mb-3" density="compact" type="info">{{ t('roleHint') }}</v-alert>

    <v-chip v-if="inputData.role_type === role" class="mb-3" color="primary">{{
      t('currentRole')
    }}</v-chip>

    <div class="d-flex ga-3 mb-3">
      <v-text-field
        v-model="search"
        clearable
        density="compact"
        hide-details
        :label="t('search')"
      />
    </div>

    <v-data-table :headers="headers" item-value="pk" :items="selection" :search="search">
      <template #item.is_active="{ item }">
        <v-chip :color="item.is_active === 1 ? 'success' : 'warning'" size="small">
          {{ t(item.is_active === 1 ? 'active' : 'inactive') }}
        </v-chip>
      </template>

      <template #item.actions="{ item }">
        <v-btn
          size="small"
          variant="text"
          @click="selection = selection.filter(x => x.pk !== item.pk)"
        >
          {{ t('remove') }}
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>
<script setup>
  import { computed, ref } from 'vue'
  import { usePartyGroupI18n } from '@/composables/usePartyGroupI18n'
  const props = defineProps({ role: { type: String, required: true } })
  const inputData = defineModel('input-data', { type: Object, required: true })
  const { t } = usePartyGroupI18n()
  const search = ref('')
  const selection = computed({
    get: () =>
      (inputData.value[`${props.role.toLowerCase()}_group_pks`] || []).map(
        pk =>
          (inputData.value.party_groups || []).find(x => x.pk === pk) || {
            pk,
            code: pk,
            role_type: props.role,
            is_active: 1,
          },
      ),
    set: rows => {
      inputData.value[`${props.role.toLowerCase()}_group_pks`] = rows.map(x => x.pk)
      const known = new Map((inputData.value.party_groups || []).map(x => [x.pk, x]))
      for (const row of rows) known.set(row.pk, row)
      inputData.value.party_groups = [...known.values()]
    },
  })
  const headers = computed(() => [
    { title: t('code'), key: 'code' },
    { title: t('description'), key: 'description' },
    { title: t('status'), key: 'is_active' },
    { title: t('actions'), key: 'actions', sortable: false },
  ])
</script> -->

<template>
  <v-sheet color="transparent">
    <v-card-text>
      <v-btn color="primary" size="small" variant="flat" @click="openGroupDialog">
        select groups
      </v-btn>
    </v-card-text>

    <v-data-table
      class="table-filter"
      :disable-sort="false"
      :fixed-header="false"
      :headers="selectedGroupHeaders"
      :height="400"
      item-value="pk"
      :items="selectedGroups"
      :show-select="false"
      striped="even"
    >
      <template #item.actions="{ item }">
        <v-menu>
          <template #activator="mScope">
            <v-btn
              v-bind="mScope.props"
              density="comfortable"
              icon="mdi-dots-vertical"
              size="small"
              variant="text"
            />
          </template>

          <v-list activatable density="compact">
            <v-list-item
              base-color="red"
              color="red"
              prepend-icon="mdi-delete"
              @click.prevent="removeSelectedGroup(item)"
            >
              <v-list-item-title>{{ common('delete') }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template #item.is_active="{ item }">
        <v-chip
          :color="item.is_active === 1 ? 'success' : 'error'"
          density="comfortable"
          size="small"
          variant="tonal"
        >
          {{ item.is_active === 1 ? common('yes') : common('no') }}
        </v-chip>
      </template>

      <template #bottom />
    </v-data-table>

    <v-dialog v-model="groupDialogVisible" max-width="900" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          select groups
          <v-spacer />

          <v-chip color="primary" size="small" variant="tonal">
            {{ common('selected', selected.length) }}
          </v-chip>
        </v-card-title>

        <v-card-text class="py-2">
          <v-form class="ref-form-pre">
            <v-row dense>
              <v-col :cols="rescols('c12m4')">
                <v-text-field
                  v-model="groupQuerySearch"
                  clearable
                  density="compact"
                  hide-details
                  :placeholder="common('queryKeywordsPlaceholder')"
                  single-line
                  variant="outlined"
                >
                  <template #prepend>
                    <div class="text-caption text-end">Query:</div>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-text class="pa-0">
          <v-data-table
            v-model="selected"
            class="table-filter"
            :disable-sort="false"
            :fixed-header="false"
            :headers="groupHeaders"
            :height="420"
            hover
            item-value="pk"
            :items="groupItems"
            :loading="loading"
            return-object
            :search="groupQuerySearch"
            :show-select="true"
            striped="even"
          >
            <template #item.is_active="{ item }">
              <v-chip
                :color="item.is_active === 1 ? 'success' : 'error'"
                density="comfortable"
                size="small"
                variant="tonal"
              >
                {{ item.is_active === 1 ? common('yes') : common('no') }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="groupDialogVisible = false">{{ common('cancel') }}</v-btn>

          <v-btn color="primary" variant="tonal" @click="applyHandle">
            {{ common('apply') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import { useDisplay } from 'vuetify'
  import { queryPartyGroupOptions } from '@/api/party-group'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import { useSystemPageI18n } from '@/composables/useSystemPageI18n'

  defineOptions({ name: 'UserPartyGroups' })

  const { common, userEdit, t } = useSystemPageI18n()

  const props = defineProps({
    activedTab: {
      type: Number,
      default: 1,
    },
    role: {
      type: String,
      default: '',
    },
  })
  const inputData = defineModel('input-data', {
    type: Object,
    default: () => ({}),
  })

  const display = useDisplay()
  const { rescols } = useLayoutCols()

  const maxHeight = computed(() => display.height.value - 320)
  const groupHeaders = computed(() => [
    { title: 'Code', key: 'code' },
    { title: 'Description', key: 'description' },
    { title: 'Status', key: 'is_active' },
  ])
  const selectedGroupHeaders = computed(() => [
    { title: '', key: 'actions', align: 'center', width: '60px', sortable: false },
    ...groupHeaders.value,
  ])
  const loading = ref(false)
  const groupDialogVisible = ref(false)
  const groupQuerySearch = ref('')

  const ensurePartyGroups = () => {
    if (!Array.isArray(inputData.value.party_groups)) {
      inputData.value.party_groups = []
    }
    if (!Array.isArray(inputData.value.agent_group_pks)) {
      inputData.value.agent_group_pks = []
    }
    if (!Array.isArray(inputData.value.consignee_group_pks)) {
      inputData.value.consignee_group_pks = []
    }
    if (!Array.isArray(inputData.value.shipper_group_pks)) {
      inputData.value.shipper_group_pks = []
    }
  }
  const selected = ref([])
  const selectedGroups = ref([])

  const openGroupDialog = () => {
    ensurePartyGroups()
    selected.value = []
    groupQuerySearch.value = ''
    groupDialogVisible.value = true
  }

  const removeSelectedGroup = item => {
    ensurePartyGroups()
    inputData.value.party_groups = inputData.value.party_groups.filter(a => a.pk !== item.pk)
    selectedGroups.value = selectedGroups.value.filter(a => a.pk !== item.pk)
    jsHandle()
  }
  const groupItems = ref([])
  const loadBaseOptions = async () => {
    loading.value = true
    try {
      const { data } = await queryPartyGroupOptions({
        role_type: props.role,
        maxResultCount: 999_999,
        skipCount: 0,
      })
      groupItems.value = Array.isArray(data?.items) ? data.items : []
    } finally {
      loading.value = false
    }
  }
  const applyHandle = () => {
    selected.value.forEach(item => {
      const ii = selectedGroups.value.findIndex(a => a.pk === item.pk)
      if (ii < 0) {
        selectedGroups.value.push(item)
      }

      const ss = inputData.value.party_groups.findIndex(a => a.pk === item.pk)
      if (ss < 0) {
        inputData.value.party_groups.push(item)
      }
    })
    jsHandle()
    groupDialogVisible.value = false
  }
  const jsHandle = () => {
    if (props.role === 'AGENT') {
      inputData.value.agent_group_pks = selectedGroups.value.map(x => x.pk)
    } else if (props.role === 'CONSIGNEE') {
      inputData.value.consignee_group_pks = selectedGroups.value.map(x => x.pk)
    } else if (props.role === 'SHIPPER') {
      inputData.value.shipper_group_pks = selectedGroups.value.map(x => x.pk)
    }
  }
  ensurePartyGroups()
  watch(
    () => props.activedTab,
    val => {
      if (val === 3 || val === 4 || val === 5) {
        const sel =
          props.role === 'AGENT'
            ? (inputData.value.agent_group_pks ?? [])
            : props.role === 'CONSIGNEE'
              ? (inputData.value.consignee_group_pks ?? [])
              : props.role === 'SHIPPER'
                ? (inputData.value.shipper_group_pks ?? [])
                : []
        selectedGroups.value = inputData.value.party_groups.filter(group =>
          sel.find(a => a === group.pk),
        )
        loadBaseOptions()
      }
    },
  )
</script>
