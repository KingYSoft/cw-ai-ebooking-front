<template>
  <v-text-field
    :class="props.class"
    :clearable="!disabled"
    density="compact"
    :disabled="disabled"
    hide-details
    :model-value="displayValue"
    readonly
    variant="outlined"
    @click:clear.stop="clearSelection"
    @click:control="openDialog"
  >
    <template #prepend>
      <div class="text-caption text-end w-label-120">{{ label }} Header:</div>
    </template>

    <template #append-inner>
      <v-btn
        :aria-label="t('selectOrganizations')"
        :disabled="disabled"
        icon="mdi-magnify"
        size="x-small"
        variant="text"
        @click.stop="openDialog"
      />
    </template>
  </v-text-field>

  <v-dialog v-model="visible" max-width="1000" persistent>
    <v-form class="ref-form-pre" color="background">
      <v-card>
        <v-card-title>{{ label }} — {{ t('selectOrganizations') }}</v-card-title>

        <v-card-text>
          <div class="d-flex ga-2 mb-3">
            <v-text-field
              v-model="query"
              clearable
              density="compact"
              hide-details
              :label="t('organizationSearch')"
              variant="outlined"
              @keydown.enter.prevent="search"
            />

            <v-btn color="primary" :loading="loading" @click="search">{{ t('search') }}</v-btn>
          </div>

          <v-alert v-if="error" class="mb-2" density="compact" type="error">{{
            t('loadFailed')
          }}</v-alert>

          <v-chip class="mb-2" color="primary" size="small">{{
            t('selectedCount', draft.length)
          }}</v-chip>

          <v-data-table-server
            v-if="visible"
            v-model="draft"
            v-model:items-per-page="pageSize"
            v-model:page="page"
            class="table-filter"
            fixed-header
            :headers="headers"
            height="360"
            item-value="pk"
            :items="items"
            :items-length="total"
            :items-per-page-options="[100, 200, 500, 1000, 2000, 5000]"
            :loading="loading"
            return-object
            :select-strategy="multiple ? 'page' : 'single'"
            show-select
            :value-comparator="sameOrganization"
            @update:options="loadOptions"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog">{{ t('cancel') }}</v-btn>

          <v-btn color="primary" :disabled="loading" @click="applySelection">
            {{ t('apply') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script setup>
  import { computed, onBeforeUnmount, ref } from 'vue'
  import { userQueryOrgHeader } from '@/api/user'
  import { normalizePartyPk } from '@/composables/partyRoleRelations'
  import { usePartyRoleI18n } from '@/composables/usePartyRoleI18n'

  const props = defineProps({
    label: { type: String, default: '' },
    multiple: Boolean,
    disabled: Boolean,
    class: { type: String, default: '' },
  })
  const model = defineModel({ type: [Object, Array], default: null })
  const { t } = usePartyRoleI18n()
  const visible = ref(false)
  const query = ref('')
  const page = ref(1)
  const pageSize = ref(200)
  const items = ref([])
  const total = ref(0)
  const draft = ref([])
  const loading = ref(false)
  const error = ref(false)
  let controller
  const sameOrganization = (left, right) =>
    normalizePartyPk(left?.pk)?.toLowerCase() === normalizePartyPk(right?.pk)?.toLowerCase()
  const headers = computed(() => [
    { title: '#', key: 'index', width: '50px', align: 'center', sortable: false },
    { title: t('organizationCode'), key: 'org_code', sortable: false },
    { title: t('organizationName'), key: 'org_full_name', sortable: false },
  ])
  const displayValue = computed(() =>
    props.multiple
      ? (model.value || []).map(item => item.org_code || item.pk).join(', ')
      : model.value?.org_code || model.value?.pk || '',
  )

  function openDialog() {
    if (props.disabled) return
    draft.value = (props.multiple ? model.value || [] : model.value ? [model.value] : []).map(
      item => ({ ...item }),
    )
    query.value = ''
    items.value = []
    total.value = 0
    page.value = 1
    error.value = false
    visible.value = true
  }

  async function loadOptions() {
    if (!visible.value) return
    controller?.abort()
    const request = new AbortController()
    controller = request
    loading.value = true
    error.value = false
    try {
      const offset = (page.value - 1) * pageSize.value
      const response = await userQueryOrgHeader(
        {
          query: query.value?.trim() || '',
          SkipCount: offset,
          MaxResultCount: pageSize.value,
        },
        request.signal,
      )
      if (request.signal.aborted) return
      if (!response.success) throw new Error('loadFailed')
      items.value = response.data?.items || []
      total.value = response.data?.totalCount || 0
      items.value = items.value.map((item, index) => ({ ...item, index: offset + index + 1 }))
    } catch (error) {
      console.error(error)

      if (!request.signal.aborted) {
        items.value = []
        total.value = 0
        error.value = true
      }
    } finally {
      if (!request.signal.aborted) loading.value = false
    }
  }

  function search() {
    if (page.value === 1) {
      loadOptions()
    } else {
      page.value = 1
    }
  }

  function closeDialog() {
    controller?.abort()
    loading.value = false
    visible.value = false
  }

  function applySelection() {
    model.value = props.multiple ? draft.value.map(item => ({ ...item })) : draft.value[0] || null
    closeDialog()
  }

  function clearSelection() {
    model.value = props.multiple ? [] : null
  }

  onBeforeUnmount(() => controller?.abort())
</script>
