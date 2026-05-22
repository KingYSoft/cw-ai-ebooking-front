<template>
  <FPageLayout :card-loading="cardLoading" :skeleton-loading="skeletonLoading">
    <template #filter>
      <PagesSystemLogsFilter
        v-model:input-search-data="inputSearchData"
        @on-reset-more="onResetMore"
        @on-search="queryData"
      />
    </template>

    <FTableLayout
      ref="refTableLayout"
      :headers="tblHeaders"
      :items="tblItems"
      :max-height="maxHeight"
      striped="even"
      title="Audit Logs"
      virtual
      @row-dblclick="onRowDblClick"
    >
      <template #item-actions="{ item }">
        <v-menu>
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              density="comfortable"
              icon="mdi-dots-vertical"
              size="small"
              variant="text"
            />
          </template>

          <v-list
            density="compact"
            item-props
            item-value="code"
            :items="getRowMenuItems(item)"
            slim
            @click:select="handleRowMenuSelect($event, item)"
          />
        </v-menu>
      </template>

      <template #item.executiontime="{ item }">
        {{ formatDateTime(item.executiontime) }}
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

    <v-dialog v-model="previewDialogVisible" max-width="1100">
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Audit Log Preview</span>

          <v-btn
            icon="mdi-close"
            size="small"
            variant="text"
            @click="previewDialogVisible = false"
          />
        </v-card-title>

        <v-divider />

        <v-card-text class="py-0">
          <v-form class="ref-form-pre">
            <v-row dense>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="previewForm.id"
                  density="compact"
                  hide-details
                  label="ID"
                  readonly
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="previewForm.servicename"
                  density="compact"
                  hide-details
                  label="Service Name"
                  readonly
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="previewForm.user_name"
                  density="compact"
                  hide-details
                  label="User Name"
                  readonly
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="previewForm.methodname"
                  density="compact"
                  hide-details
                  label="Method Name"
                  readonly
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="previewForm.executiontime"
                  density="compact"
                  hide-details
                  label="Execution Time"
                  readonly
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="previewForm.executionduration"
                  density="compact"
                  hide-details
                  label="Execution Duration (ms)"
                  readonly
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="previewForm.clientipaddress"
                  density="compact"
                  hide-details
                  label="Client IP Address"
                  readonly
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="previewForm.browserinfo"
                  density="compact"
                  hide-details
                  label="Browser Info"
                  readonly
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="previewForm.parameters"
                  :auto-grow="false"
                  density="compact"
                  hide-details
                  label="Parameters"
                  no-resize
                  readonly
                  rows="3"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="previewForm.returnvalue"
                  :auto-grow="false"
                  density="compact"
                  hide-details
                  label="Return Value"
                  no-resize
                  readonly
                  rows="8"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="previewForm.exceptionmessage"
                  :auto-grow="false"
                  density="compact"
                  hide-details
                  label="Exception Message"
                  no-resize
                  readonly
                  rows="2"
                  variant="outlined"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="previewForm.exception"
                  :auto-grow="false"
                  density="compact"
                  hide-details
                  label="Exception"
                  no-resize
                  readonly
                  rows="2"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />

        <template #actions>
          <v-spacer />

          <v-btn
            size="small"
            :text="t('$vuetify.custom.dialog.btn.cancel')"
            @click="previewDialogVisible = false"
          />

          <v-btn
            color="primary"
            size="small"
            :text="t('$vuetify.custom.dialog.btn.ok')"
            variant="flat"
            @click="previewDialogVisible = false"
          />
        </template>
      </v-card>
    </v-dialog>
  </FPageLayout>
</template>

<script setup>
  import { computed, nextTick, ref } from 'vue'
  import { useDisplay, useLocale } from 'vuetify'
  import { queryAuditLog } from '@/api/logs'
  import FDataTableFooter from '@/components/FDataTableFooter.vue'
  import FPageLayout from '@/components/FPageLayout.vue'
  import FTableLayout from '@/components/FTableLayout.vue'
  import PagesSystemLogsFilter from '@/components/system/PagesSystemLogsFilter.vue'
  import { useAppStore } from '@/stores/app'

  defineOptions({ name: 'SystemLogs' })
  definePage({
    name: 'system_logs',
    icon: 'mdi-text-box-search-outline',
    menu: true,
    order: 7,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
    },
  })

  const display = useDisplay()
  const appStore = useAppStore()
  const { t } = useLocale()

  const contentHeight = computed(() => display.height.value - 65 - 35)
  const maxHeight = computed(() => contentHeight.value - 12 - 65 - 52 - 14)
  const skeletonLoading = ref(true)
  const cardLoading = ref(false)

  const defaultFilterData = () => ({
    field1: {
      key: 'executionTime',
      title: 'Execution Time',
      keyItems: [{ key: 'executionTime', title: 'Execution Time' }],
      val: '',
      op: 'between',
      start: appStore.utils.formatDate(new Date()),
      end: appStore.utils.formatDate(new Date()),
    },
    field2: {
      key: 'methodName',
      title: 'Method Name',
      keyItems: [
        { key: 'methodName', title: 'Method Name' },
        { key: 'serviceName', title: 'Service Name' },
      ],
      val: '',
      op: 'Contain',
    },
    clientIpAddress: {
      key: 'clientIpAddress',
      title: 'Client IP',
      val: '',
      op: 'Contain',
      componentProps: {},
      componentType: 'v-text-field',
      more: true,
    },
    clientName: {
      key: 'clientName',
      title: 'Client Name',
      val: '',
      op: 'Contain',
      componentProps: {},
      componentType: 'v-text-field',
      more: true,
    },
    executionDuration: {
      key: 'executionDuration',
      title: 'Execution Duration',
      val: '',
      op: '>=',
      componentProps: {},
      componentType: 'v-text-field',
      more: true,
    },
  })

  const inputSearchData = ref(defaultFilterData())
  const onResetMore = () => {
    inputSearchData.value = defaultFilterData()
  }

  const refTableLayout = ref(null)
  const tblItems = ref([])
  const pageObj = ref({
    pageSize: 100,
    pageIndex: 1,
    items: [
      { value: 100, title: '100' },
      { value: 200, title: '200' },
      { value: 500, title: '500' },
      { value: 1000, title: '1000' },
    ],
  })
  const totalCount = ref(0)

  const tblHeaders = computed(() => [
    { title: '', key: 'actions', align: 'center', sortable: false, width: '40px' },
    { title: '#', key: 'index', align: 'center', sortable: false, minWidth: '40px' },
    { title: 'Service Name', key: 'servicename', align: 'start', minWidth: '180px' },
    { title: 'Method Name', key: 'methodname', align: 'start', minWidth: '180px' },
    { title: 'Client IP', key: 'clientipaddress', align: 'start', minWidth: '140px' },
    { title: 'User Name', key: 'user_name', align: 'start', minWidth: '140px' },
    { title: 'Execution Time', key: 'executiontime', align: 'start', minWidth: '180px' },
    { title: 'Duration (ms)', key: 'executionduration', align: 'start', minWidth: '130px' },
  ])

  const buildFilter = () => {
    const filters = [
      {
        key: inputSearchData.value.field1.key,
        op: 'between',
        val: '',
        start: inputSearchData.value.field1.start,
        end: inputSearchData.value.field1.end,
      },
      {
        key: inputSearchData.value.field2.key,
        op: inputSearchData.value.field2.op,
        val: inputSearchData.value.field2.val,
      },
    ]

    Object.keys(inputSearchData.value).forEach(key => {
      const current = inputSearchData.value[key]
      if (current.more) {
        filters.push({
          key: current.key,
          op: current.op,
          val: current.val,
        })
      }
    })

    return filters
  }

  const queryData = async () => {
    cardLoading.value = true
    try {
      const { data } = await queryAuditLog({
        SkipCount: (pageObj.value.pageIndex - 1) * pageObj.value.pageSize,
        MaxResultCount: pageObj.value.pageSize,
        filters: buildFilter(),
      })
      skeletonLoading.value = false
      if (data) {
        const items = data.items ?? []
        tblItems.value = items.map((item, index) => ({
          ...item,
          index: (pageObj.value.pageIndex - 1) * pageObj.value.pageSize + index + 1,
        }))
        totalCount.value = data.totalCount || 0
        nextTick(() => {
          if (refTableLayout.value) {
            refTableLayout.value.initHeaders()
            refTableLayout.value.initScrollListener()
          }
        })
      }
    } catch (error) {
      console.error('Query audit log failed:', error)
    } finally {
      cardLoading.value = false
    }
  }
  queryData()

  const previewDialogVisible = ref(false)
  const previewForm = ref(getEmptyPreviewForm())

  function getEmptyPreviewForm() {
    return {
      id: '',
      servicename: '',
      methodname: '',
      user_name: '',
      parameters: '',
      returnvalue: '',
      executiontime: '',
      executionduration: '',
      clientipaddress: '',
      browserinfo: '',
      exceptionmessage: '',
      exception: '',
    }
  }

  function formatDateTime(value) {
    if (!value) {
      return ''
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      return value
    }

    return appStore.utils.formatUTCTime(date, 'yyyy-MM-dd HH:mm:ss.ms')
  }

  function openPreview(item) {
    previewForm.value = {
      id: String(item.id ?? ''),
      servicename: item.servicename ?? '',
      methodname: item.methodname ?? '',
      user_name: item.user_name ?? '',
      parameters: item.parameters ?? '',
      returnvalue: item.returnvalue ?? '',
      executiontime: formatDateTime(item.executiontime),
      executionduration: String(item.executionduration ?? ''),
      clientipaddress: item.clientipaddress ?? '',
      browserinfo: item.browserinfo ?? '',
      exceptionmessage: item.exceptionmessage ?? '',
      exception: item.exception ?? '',
    }
    previewDialogVisible.value = true
  }

  function onRowDblClick(event, { item }) {
    if (
      event?.target?.closest('.v-selection-control, button, a, input, textarea, [role="button"]')
    ) {
      return
    }
    openPreview(item)
  }
  const getRowMenuItems = () => [{ title: 'Preview', prependIcon: 'mdi-preview', code: 'preview' }]
  const handleRowMenuSelect = (e, item) => {
    switch (e.id) {
      case 'preview': {
        return openPreview(item)
      }
      default: {
        break
      }
    }
  }
</script>
