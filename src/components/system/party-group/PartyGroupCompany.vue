<template>
  <v-sheet color="transparent">
    <v-card-text>
      <v-btn color="primary" size="small" variant="flat" @click="openCompanyDialog">
        select company
      </v-btn>
    </v-card-text>

    <v-data-table
      class="table-filter"
      :disable-sort="false"
      :fixed-header="false"
      :headers="selectedCompanyHeaders"
      :height="maxHeight"
      item-value="pk"
      :items="inputData.org_header_list"
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
              @click.prevent="removeSelectedCompany(item)"
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
    </v-data-table>

    <v-dialog v-model="companyDialogVisible" max-width="900" persistent>
      <v-card :loading="loading">
        <v-card-title class="d-flex align-center">
          Select Company
          <v-spacer />

          <v-chip color="primary" size="small" variant="tonal">
            {{ common('selected', companyDialogSelected.length) }}
          </v-chip>
        </v-card-title>

        <v-card-text class="py-2">
          <v-form class="ref-form-pre">
            <v-row dense>
              <v-col :cols="rescols('c12m4')">
                <v-text-field
                  v-model="companyQuerySearch"
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

              <v-col class="d-flex align-center" :cols="rescols('c12m4')">
                <v-btn
                  color="primary"
                  :disabled="loading"
                  :loading="loading"
                  size="small"
                  @click="loadOptions"
                >
                  Search
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-text class="pa-0">
          <v-data-table-server
            v-model="selectedCompany"
            v-model:items-per-page="pageSize"
            v-model:page="page"
            class="table-filter"
            fixed-header
            :headers="companyHeaders"
            :height="420"
            item-value="pk"
            :items="companyList"
            :items-length="totalCount"
            :items-per-page-options="[100, 200, 500, 1000, 2000, 5000]"
            :loading="loading"
            return-object
            select-strategy="page"
            show-select
            striped="even"
            @update:options="loadOptions"
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
          </v-data-table-server>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn variant="text" @click="companyDialogVisible = false">{{ common('cancel') }}</v-btn>

          <v-btn color="primary" variant="tonal" @click="handleApply">
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
  import { userQueryOrgHeader } from '@/api/user'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import { useSystemPageI18n } from '@/composables/useSystemPageI18n'

  defineOptions({ name: 'PartyGroupCompany' })

  const { common, userEdit } = useSystemPageI18n()

  const props = defineProps({
    activedTab: {
      type: Number,
      default: 1,
    },
    groupPk: {
      type: String,
      default: null,
    },
  })
  const inputData = defineModel('input-data', {
    type: Object,
    default: () => ({}),
  })

  const display = useDisplay()
  const { rescols } = useLayoutCols()

  const maxHeight = computed(() => display.height.value - 320)
  const companyHeaders = computed(() => [
    { title: 'Code', key: 'org_code', align: 'start', minWidth: '160px' },
    { title: 'Name', key: 'org_full_name', align: 'start', minWidth: '220px' },
    {
      title: 'Is Active',
      key: 'is_active',
      align: 'start',
      minWidth: '120px',
    },
  ])
  const selectedCompanyHeaders = computed(() => [
    { title: '', key: 'actions', align: 'center', width: '60px', sortable: false },
    ...companyHeaders.value,
  ])
  const companyList = ref([])
  const loading = ref(false)
  const companyDialogVisible = ref(false)
  const companyQuerySearch = ref('')

  const ensureCompanyList = () => {
    if (!Array.isArray(inputData.value.org_header_list)) {
      inputData.value.org_header_list = []
    }
  }
  ensureCompanyList()

  const companyDialogSelected = computed(() => {
    return inputData.value.org_header_list
  })

  const selectedCompany = ref([])

  const openCompanyDialog = () => {
    selectedCompany.value = []
    companyQuerySearch.value = ''
    companyDialogVisible.value = true
  }

  const removeSelectedCompany = item => {
    inputData.value.org_header_list = inputData.value.org_header_list.filter(a => a.pk !== item.pk)
  }

  const page = ref(1)
  const pageSize = ref(200)
  const totalCount = ref(0)

  let controller
  async function loadOptions() {
    if (!companyDialogVisible.value) return
    controller?.abort()
    const request = new AbortController()
    controller = request
    loading.value = true
    try {
      const offset = (page.value - 1) * pageSize.value
      const response = await userQueryOrgHeader(
        {
          query: companyQuerySearch.value?.trim() || '',
          SkipCount: offset,
          MaxResultCount: pageSize.value,
        },
        request.signal,
      )
      if (request.signal.aborted) return
      if (response.success) {
        const items = response.data?.items || []
        totalCount.value = response.data?.totalCount || 0
        companyList.value = items.map((item, index) => ({
          ...item,
          index: offset + index + 1,
        }))
      }
    } catch (error) {
      console.error(error)

      if (!request.signal.aborted) {
        companyList.value = []
        totalCount.value = 0
      }
    } finally {
      if (!request.signal.aborted) loading.value = false
    }
  }
  const handleApply = () => {
    selectedCompany.value.forEach(item => {
      const idx = inputData.value.org_header_list.findIndex(a => a.pk === item.pk)
      if (idx < 0) {
        inputData.value.org_header_list.push(item)
      }
    })
    companyDialogVisible.value = false
  }
  watch(
    () => companyDialogVisible.value,
    val => {
      if (val) {
        loadOptions()
      }
    },
  )
</script>
