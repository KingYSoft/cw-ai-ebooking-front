<template>
  <FPageLayout :card-loading="tableLoading" :skeleton-loading="skeletonLoading">
    <template #filter>
      <PageFilterBar
        v-model:input-search-data="inputSearchData"
        @on-reset-more="onResetMore"
        @on-search="fetchData"
      >
        <v-col :cols="rescols('c12l4m4')">
          <div class="d-flex align-center ga-1">
            <v-select
              v-model="inputSearchData.field1.key"
              auto-select-first
              density="compact"
              hide-details
              item-title="title"
              item-value="key"
              :items="inputSearchData.field1.keyItems"
              max-width="120"
              variant="underlined"
            />

            <FDatePicker
              v-model:date-value="inputSearchData.field1.start"
              :date-props="{ placeholder: 'Start Date', clearable: false }"
              :max="inputSearchData.field1.end ?? '2099-12-31'"
              min="2000-01-01"
              min-width="auto"
              width="100"
            />
            -
            <FDatePicker
              v-model:date-value="inputSearchData.field1.end"
              :date-props="{ placeholder: 'End Date', clearable: false }"
              max="2099-12-31"
              :min="inputSearchData.field1.start ?? '2000-01-01'"
              min-width="auto"
              width="100"
            />
          </div>
        </v-col>

        <v-col :cols="rescols('c12l6m6s6')">
          <div class="d-flex align-center ga-1">
            <v-select
              v-model="inputSearchData.field2.key"
              auto-select-first
              density="compact"
              hide-details
              item-title="title"
              item-value="key"
              :items="inputSearchData.field2.keyItems"
              max-width="120"
              min-width="120"
              variant="underlined"
              width="120"
            />

            <v-text-field
              v-model="inputSearchData.field2.val"
              density="compact"
              hide-details
              placeholder="Job Number"
              variant="outlined"
            />
          </div>
        </v-col>
      </PageFilterBar>
    </template>

    <FTableLayout
      ref="refTableLayout"
      v-model="tableSelected"
      :headers="tableHeaders"
      :items="tableData"
      :items-per-page="itemsPerPage"
      :max-height="maxHeight"
      striped="even"
      :title="t('$vuetify.custom.poPage.title.list')"
      @row-dblclick="onRowDblClick"
      @update:items-per-page="handleItemsPerPageChange"
      @update:page="handlePageChange"
    >
      <template #actions>
        <v-btn color="primary" prepend-icon="$plus" size="small" variant="flat" @click="onNewPO">{{
          t('$vuetify.custom.poPage.button.new')
        }}</v-btn>
      </template>

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
    </FTableLayout>

    <!-- 删除确认对话框 -->
    <v-dialog v-model="deleteDialogVisible" max-width="400" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="error" start>mdi-alert-circle</v-icon>
          {{ t('$vuetify.custom.poPage.deleteDialog.title') }}
        </v-card-title>

        <v-card-text>
          {{ t('$vuetify.custom.poPage.deleteDialog.message', deleteItem?.po_number || '') }}
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn size="small" variant="text" @click="deleteDialogVisible = false">
            {{ t('$vuetify.custom.poPage.deleteDialog.cancel') }}
          </v-btn>

          <v-btn
            color="error"
            :loading="deleting"
            size="small"
            variant="flat"
            @click="confirmDelete"
          >
            {{ t('$vuetify.custom.poPage.deleteDialog.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </FPageLayout>
</template>

<script setup>
  import { computed, nextTick, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useDisplay, useLocale } from 'vuetify'
  import FDatePicker from '@/components/FDatePicker.vue'
  import FTableLayout from '@/components/FTableLayout.vue'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import { useAppStore } from '@/stores/app'

  const router = useRouter()
  const appStore = useAppStore()
  const display = useDisplay()
  const { t } = useLocale()
  const { rescols } = useLayoutCols()

  defineOptions({ name: 'PoDetails' })
  definePage({
    name: 'po_details',
    icon: 'mdi-clipboard-list-outline',
    menu: true,
    order: 1,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      //   permissions: 'PERMISSION_PO_DETAILS',
    },
  })

  // #region Layout & Display
  const contentHeight = computed(() => display.height.value - 65 - 35)
  const maxHeight = computed(() => contentHeight.value - 12 - 65 - 52 - 14)
  const skeletonLoading = ref(true)
  const tableLoading = ref(false)
  // #endregion

  // #region Search & Filter
  const defaultData = () => ({
    field1: {
      key: 'ex_required_date',
      title: t('$vuetify.custom.poPage.filter.exRequiredDate'),
      keyItems: [
        {
          key: 'ex_required_date',
          title: t('$vuetify.custom.poPage.filter.exRequiredDate'),
        },
        {
          key: 'delivery_required_date',
          title: t('$vuetify.custom.poPage.filter.deliveryRequiredDate'),
        },
      ],
      val: '',
      op: '=',
      start: '',
      end: '',
    },
    field2: {
      key: 'po_number',
      title: t('$vuetify.custom.poPage.filter.poNumber'),
      keyItems: [{ key: 'po_number', title: t('$vuetify.custom.poPage.filter.poNumber') }],
      val: '',
      op: '=',
    },
    buyer_name: {
      key: 'buyer_name',
      title: t('$vuetify.custom.poPage.filter.buyerName'),
      val: '',
      op: '=',
      componentProps: {},
      componentType: 'v-text-field',
      more: true,
    },
    seller_name: {
      key: 'seller_name',
      title: t('$vuetify.custom.poPage.filter.sellerName'),
      val: '',
      op: '=',
      componentProps: {},
      componentType: 'v-text-field',
      more: true,
    },
    po_controller: {
      key: 'po_controller',
      title: t('$vuetify.custom.poPage.filter.poController'),
      val: '',
      op: '=',
      componentProps: {},
      componentType: 'v-text-field',
      more: true,
    },
    transport_mode: {
      key: 'transport_mode',
      title: t('$vuetify.custom.poPage.filter.transportMode'),
      val: '',
      op: '=',
      componentProps: {},
      componentType: 'v-text-field',
      more: true,
    },
    origin: {
      key: 'origin',
      title: t('$vuetify.custom.poPage.filter.origin'),
      val: '',
      op: '=',
      componentProps: {},
      componentType: 'v-text-field',
      more: true,
    },
    destination: {
      key: 'destination',
      title: t('$vuetify.custom.poPage.filter.destination'),
      val: '',
      op: '=',
      componentProps: {},
      componentType: 'v-text-field',
      more: true,
    },
  })

  const inputSearchData = ref(defaultData())

  const onResetMore = () => {
    inputSearchData.value = defaultData()
    currentPage.value = 1
    fetchData()
  }
  // #endregion

  // #region Table Data
  const refTableLayout = ref(null)
  const tableSelected = ref([])
  const tableData = ref([])
  const mockPoList = ref([
    {
      pk: 'PO-2026-0001',
      id: 1,
      po_number: 'PO-2026-0001',
      buyer_name: 'ABC Corporation',
      seller_name: 'China Manufacturing Co.',
      po_controller: 'Alice Chen',
      transport_mode: 'SEA',
      origin: 'Shanghai',
      destination: 'Sydney',
      order_date: '2026-01-08',
      ex_required_date: '2026-01-20',
      delivery_required_date: '2026-02-12',
      order_status: 'In Progress',
      total_amount: 58_600,
    },
    {
      pk: 'PO-2026-0002',
      id: 2,
      po_number: 'PO-2026-0002',
      buyer_name: 'XYZ Trading Co.',
      seller_name: 'Vietnam Exports Ltd',
      po_controller: 'Brian Lee',
      transport_mode: 'AIR',
      origin: 'Ho Chi Minh City',
      destination: 'Melbourne',
      order_date: '2026-01-15',
      ex_required_date: '2026-01-24',
      delivery_required_date: '2026-02-02',
      order_status: 'Confirmed',
      total_amount: 32_450.75,
    },
    {
      pk: 'PO-2026-0003',
      id: 3,
      po_number: 'PO-2026-0003',
      buyer_name: 'Global Imports Ltd',
      seller_name: 'India Suppliers Inc',
      po_controller: 'Carol Wang',
      transport_mode: 'ROAD',
      origin: 'Mumbai',
      destination: 'Brisbane',
      order_date: '2026-02-03',
      ex_required_date: '2026-02-14',
      delivery_required_date: '2026-03-05',
      order_status: 'Draft',
      total_amount: 18_920,
    },
    {
      pk: 'PO-2026-0004',
      id: 4,
      po_number: 'PO-2026-0004',
      buyer_name: 'Pacific Traders',
      seller_name: 'Thailand Trading',
      po_controller: 'David Ho',
      transport_mode: 'RAIL',
      origin: 'Bangkok',
      destination: 'Adelaide',
      order_date: '2026-02-18',
      ex_required_date: '2026-03-02',
      delivery_required_date: '2026-03-24',
      order_status: 'Completed',
      total_amount: 44_100,
    },
    {
      pk: 'PO-2026-0005',
      id: 5,
      po_number: 'PO-2026-0005',
      buyer_name: 'Eastern Supplies',
      seller_name: 'Malaysia Products',
      po_controller: 'Emily Tan',
      transport_mode: 'MULTIMODAL',
      origin: 'Kuala Lumpur',
      destination: 'Perth',
      order_date: '2026-03-04',
      ex_required_date: '2026-03-18',
      delivery_required_date: '2026-04-09',
      order_status: 'Cancelled',
      total_amount: 25_780.5,
    },
    {
      pk: 'PO-2026-0006',
      id: 6,
      po_number: 'PO-2026-0006',
      buyer_name: 'ABC Corporation',
      seller_name: 'Vietnam Exports Ltd',
      po_controller: 'Alice Chen',
      transport_mode: 'SEA',
      origin: 'Da Nang',
      destination: 'Auckland',
      order_date: '2026-03-21',
      ex_required_date: '2026-04-01',
      delivery_required_date: '2026-04-28',
      order_status: 'In Progress',
      total_amount: 67_320,
    },
  ])

  // Pagination
  const currentPage = ref(1)
  const itemsPerPage = ref(100)

  const tableHeaders = ref([
    { title: '', key: 'actions', align: 'center', sortable: false, width: '36px' },
    { title: t('$vuetify.custom.poPage.table.headers.poNumber'), key: 'po_number', width: '150px' },
    {
      title: t('$vuetify.custom.poPage.table.headers.buyerName'),
      key: 'buyer_name',
      width: '200px',
    },
    {
      title: t('$vuetify.custom.poPage.table.headers.sellerName'),
      key: 'seller_name',
      width: '200px',
    },
    {
      title: t('$vuetify.custom.poPage.table.headers.orderDate'),
      key: 'order_date',
      width: '120px',
    },
    {
      title: t('$vuetify.custom.poPage.table.headers.status'),
      key: 'order_status',
      width: '120px',
    },
    { title: t('$vuetify.custom.poPage.table.headers.origin'), key: 'origin', width: '100px' },
    {
      title: t('$vuetify.custom.poPage.table.headers.destination'),
      key: 'destination',
      width: '100px',
    },
    {
      title: t('$vuetify.custom.poPage.table.headers.totalAmount'),
      key: 'total_amount',
      width: '150px',
      align: 'end',
    },
  ])

  const normalizeSearchValue = value =>
    String(value ?? '')
      .trim()
      .toLowerCase()

  const isDateInRange = (value, start, end) => {
    if (!start && !end) return true
    if (!value) return false

    return (!start || value >= start) && (!end || value <= end)
  }

  const filterMockPoList = data => {
    const poNumber = normalizeSearchValue(data.field2.val)

    return mockPoList.value.filter(item => {
      if (!isDateInRange(item[data.field1.key], data.field1.start, data.field1.end)) {
        return false
      }

      if (poNumber && !normalizeSearchValue(item.po_number).includes(poNumber)) {
        return false
      }

      return Object.keys(data).every(key => {
        const filter = data[key]
        if (!filter.more || !filter.val) return true

        return normalizeSearchValue(item[filter.key]).includes(normalizeSearchValue(filter.val))
      })
    })
  }

  const fetchData = () => {
    tableLoading.value = true
    try {
      const data = inputSearchData.value
      const filteredItems = filterMockPoList(data)

      skeletonLoading.value = false
      tableData.value = filteredItems
      nextTick(() => {
        if (refTableLayout.value) {
          refTableLayout.value.initHeaders()
          refTableLayout.value.initScrollListener()
        }
      })
    } catch (error) {
      console.error('Search error:', error)
      tableData.value = []
      appStore.openMessage({
        content: t(
          '$vuetify.custom.poPage.message.searchFailed',
          error.message || t('$vuetify.custom.poPage.message.unknownError'),
        ),
        color: 'error',
      })
    } finally {
      tableLoading.value = false
    }
  }
  fetchData()

  const onRowDblClick = (event, { item }) => {
    if (event.target.closest('.v-selection-control, button, a, input, textarea, [role="button"]'))
      return
    router.push({ name: 'po_edit-pk', params: { pk: item.pk }, query: { id: item.po_number } })
  }
  // #endregion

  // #region New PO
  const onNewPO = () => {
    router.push({ name: 'po_new' })
  }
  // #endregion

  // #region Row Actions Menu
  const getRowMenuItems = () => [
    { title: t('$vuetify.custom.poPage.menu.edit'), prependIcon: 'mdi-pencil', code: 'edit' },
    {
      title: t('$vuetify.custom.poPage.menu.delete'),
      prependIcon: 'mdi-delete',
      code: 'delete',
      color: 'red',
    },
  ]

  const handleRowMenuSelect = (e, item) => {
    switch (e.code) {
      case 'edit': {
        return router.push({
          name: 'po_edit-pk',
          params: { pk: item.pk },
          query: { id: item.po_number },
        })
      }
      case 'delete': {
        deleteItem.value = item
        deleteDialogVisible.value = true
        return
      }
      default: {
        break
      }
    }
  }
  // #endregion

  // #region Pagination
  const handlePageChange = page => {
    currentPage.value = page
    fetchData()
  }

  const handleItemsPerPageChange = itemsPerPageValue => {
    itemsPerPage.value = itemsPerPageValue
    currentPage.value = 1 // 重置到第一页
    fetchData()
  }
  // #endregion

  // #region Delete Dialog
  const deleteDialogVisible = ref(false)
  const deleteItem = ref(null)
  const deleting = ref(false)

  const confirmDelete = () => {
    if (!deleteItem.value) return

    try {
      deleting.value = true
      mockPoList.value = mockPoList.value.filter(item => item.id !== deleteItem.value.id)
      appStore.openMessage({
        content: t('$vuetify.custom.poPage.message.deleteSuccess'),
        color: 'success',
      })
      deleteDialogVisible.value = false
      deleteItem.value = null
      fetchData()
    } catch (error) {
      console.error(error)
      appStore.openMessage({
        content: t(
          '$vuetify.custom.poPage.message.deleteFailed',
          error.message || t('$vuetify.custom.poPage.message.unknownError'),
        ),
        color: 'error',
      })
    } finally {
      deleting.value = false
    }
  }
  // #endregion
</script>
