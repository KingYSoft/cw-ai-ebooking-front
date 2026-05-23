<template>
  <v-sheet>
    <FTableLayout
      ref="refTblDataLogs"
      v-model="tblSelectedLogs"
      :headers="tblLogsHeaders"
      :items="logsTableData"
      :max-height="maxHeight"
      setting-name="BOOKING_LOG_HEADER_01"
      :show-select="false"
      striped="even"
      title="Logs"
      virtual
      @row-dblclick="onRowDblClick"
    >
      <template #item.change_time="{ item }">
        {{ appStore.utils.formatUTCTime(item.change_time) }}
      </template>

      <template #bottom>
        <v-divider />

        <FDataTableFooter
          v-model:page-obj="pageObj"
          :total-count="totalCount"
          @query-tbl="queryData"
        />
      </template>
    </FTableLayout>

    <v-dialog v-model="diaVis" max-width="800" persistent scrollable>
      <v-card
        :disabled="logsTableLoading"
        :loading="logsTableLoading"
        prepend-icon="mdi-city"
        :title="rowData.title"
      >
        <template #loader="{ isActive }">
          <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
        </template>

        <template #append>
          <v-btn
            color="red"
            density="comfortable"
            icon="mdi-close"
            size="small"
            variant="tonal"
            @click="diaVis = false"
          />
        </template>

        <v-card-text class="py-2">
          <v-form ref="refRoleForm">
            <v-row dense>
              <v-col :cols="12">
                <v-textarea
                  :auto-grow="false"
                  density="comfortable"
                  label="Content"
                  :model-value="rowData.change_content"
                  :no-resize="false"
                  readonly
                  :rows="12"
                />
              </v-col>

              <v-col :cols="6">
                <v-text-field
                  density="comfortable"
                  label="Modified User"
                  :model-value="rowData.change_user"
                  readonly
                />
              </v-col>

              <v-col :cols="6">
                <v-text-field
                  density="comfortable"
                  label="Modified Time"
                  :model-value="appStore.utils.formatUTCTime(rowData.change_time)"
                  readonly
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            :text="t('$vuetify.custom.dialog.btn.close')"
            variant="plain"
            @click="diaVis = false"
          />

          <v-btn
            color="primary"
            :text="t('$vuetify.custom.dialog.btn.ok')"
            variant="tonal"
            @click="diaVis = false"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>

<script setup>
  import { computed, onMounted, ref, toRefs, watch } from 'vue'
  import { useLocale } from 'vuetify'
  import { queryEntityLog } from '@/api/logs'
  import FTableLayout from '@/components/FTableLayout.vue'
  // import { useLayoutCols } from '@/composables/useLayoutCols'
  import { useAppStore } from '@/stores/app'

  defineOptions({
    name: 'BookingLogs',
  })

  const props = defineProps({
    entityId: {
      type: Number,
      default: 0,
    },
    activedTab: {
      type: Number,
      default: 0,
    },
  })
  const { entityId, activedTab } = toRefs(props)

  const appStore = useAppStore()
  const { t } = useLocale()
  const refTblDataLogs = ref(null)
  const tblSelectedLogs = ref([])

  const maxHeight = computed(() => {
    const clientHeight = document.documentElement.clientHeight
    return clientHeight - 272
  })

  const logsTableLoading = ref(false)
  const logsTableData = ref([])

  const initTable = () => {
    if (refTblDataLogs.value) {
      refTblDataLogs.value.initHeaders()
      refTblDataLogs.value.initScrollListener()
    }
  }

  onMounted(() => {
    initTable()
  })
  const tblLogsHeaders = ref([
    { title: '#', key: 'index', align: 'center', sortable: false, width: '40' },
    {
      title: 'Title',
      key: 'title',
      align: 'start',
      minWidth: '120',
      nowrap: true,
      filterable: true,
    },
    {
      title: 'Content',
      key: 'change_content',
      align: 'start',
      minWidth: '120',
      maxWidth: '400px',
      cellProps: {
        class: 'text-truncate',
      },
      nowrap: true,
      filterable: true,
    },
    {
      title: 'Modified Time',
      key: 'change_time',
      align: 'start',
      minWidth: '120',
      nowrap: true,
      filterable: true,
    },
    {
      title: 'Modified User',
      key: 'change_user',
      align: 'start',
      minWidth: '120',
      nowrap: true,
      filterable: true,
    },
  ])

  const inputSearchData = ref({
    entity_name: 'BKG_BOOKING',
    start_date: appStore.utils.formatDate(appStore.utils.addDays(new Date(), -15)),
    end_date: appStore.utils.formatDate(appStore.utils.addDays(new Date(), 0)),
  })
  const pageObj = ref({
    pageSize: 2000,
    pageIndex: 1,
    items: [
      { value: 100, title: '100' },
      { value: 200, title: '200' },
      { value: 500, title: '500' },
      { value: 1000, title: '1000' },
    ],
  })
  const totalCount = ref(0)

  const queryData = async () => {
    try {
      logsTableLoading.value = true

      if (entityId.value <= 0) {
        return
      }
      const searchPayload = {
        ...inputSearchData.value,
        SkipCount: (pageObj.value.pageIndex - 1) * pageObj.value.pageSize,
        MaxResultCount: pageObj.value.pageSize,
        entity_id: entityId.value,
      }
      const { success, data } = await queryEntityLog(searchPayload)
      if (success && data) {
        const items = data.items ?? []
        logsTableData.value = items.map((item, index) => ({
          ...item,
          index: (pageObj.value.pageIndex - 1) * pageObj.value.pageSize + index + 1,
        }))
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      logsTableLoading.value = false
    }
  }

  const diaVis = ref(false)
  const rowData = ref({})
  function onRowDblClick(event, { item }) {
    if (event.target.closest('.v-selection-control, button, a, input, textarea, [role="button"]'))
      return
    rowData.value = { ...item }
    diaVis.value = true
  }

  watch(
    () => activedTab.value,
    val => {
      if (val === 5) {
        queryData()
      }
    },
    { immediate: true },
  )
</script>
