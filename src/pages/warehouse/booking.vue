<template>
  <FPageLayout :card-loading="cardLoading" :skeleton-loading="skeletonLoading">
    <template #filter>
      <PagesWarehouseBookingFilter
        ref="refFilter"
        v-model:input-search-data="inputSearchData"
        @on-reset-more="onResetMore"
        @on-search="queryData"
      />
    </template>

    <FTableLayout
      ref="refTableLayout"
      v-model="tblSelected"
      class="table-layout"
      :headers="tblHeaders"
      :items="tblItems"
      :max-height="maxHeight"
      show-select
      striped="even"
      :title="list('pageTitle')"
      virtual
      @row-dblclick="onRowDblClick"
    >
      <template #actions>
        <v-btn
          color="primary"
          :disabled="cardLoading || importLoading"
          prepend-icon="mdi-upload"
          size="small"
          variant="flat"
          @click="importDialogOpen = true"
        >
          {{ importI18n('action') }}
        </v-btn>

        <v-btn color="primary" prepend-icon="$plus" size="small" variant="flat" @click="onNewOrder">
          {{ list('new') }}
        </v-btn>
      </template>

      <template #item.so_release="{ item }">
        <v-icon
          v-if="String(item.so_release ?? '').toUpperCase() === 'Y'"
          icon="mdi-file-pdf-box"
          @click.prevent
        />
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

    <WarehouseOrderImportDialog
      v-model="importDialogOpen"
      :loading="importLoading"
      @upload="onImportUpload"
    />
  </FPageLayout>
</template>

<script setup>
  import { computed, nextTick, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useDisplay } from 'vuetify'

  import { recognizeWhsBookingFile, whsOrderQueryPage } from '@/api/whs-order'
  import FDataTableFooter from '@/components/FDataTableFooter.vue'
  import FPageLayout from '@/components/FPageLayout.vue'
  import FTableLayout from '@/components/FTableLayout.vue'
  import PagesWarehouseBookingFilter from '@/components/warehouse/PagesWarehouseBookingFilter.vue'
  import WarehouseOrderImportDialog from '@/components/warehouse/WarehouseOrderImportDialog.vue'
  import { mapWhsOrderListRow } from '@/composables/mapWhsOrderDetail'
  import { WHS_ORDER_RECOGNIZE_STORAGE_KEY } from '@/composables/useWarehouseBookingForm'
  import { useWarehouseOrderPageI18n } from '@/composables/useWarehouseOrderPageI18n'
  import { useAppStore } from '@/stores/app'

  const { filter, header, list, import: importI18n } = useWarehouseOrderPageI18n()
  const appStore = useAppStore()
  const router = useRouter()
  const display = useDisplay()

  defineOptions({ name: 'WarehouseBooking' })
  definePage({
    name: 'warehouse_booking',
    icon: 'mdi-clipboard-list-outline',
    menu: true,
    order: 1,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
    },
  })

  const contentHeight = computed(() => display.height.value - 65 - 35)
  const refFilter = ref(null)
  const maxHeight = computed(() => {
    return contentHeight.value - (refFilter.value?.$el?.clientHeight ?? 0) - 12 - 52 - 14
  })
  const skeletonLoading = ref(true)
  const cardLoading = ref(false)

  const defaultData = () => ({
    field1: {
      key: 'wso_etd',
      title: filter('etd'),
      keyItems: [{ key: 'wso_etd', title: filter('etd') }],
      val: '',
      op: '=',
      start: appStore.utils.formatDate(appStore.utils.addDays(new Date(), -20)),
      end: appStore.utils.formatDate(appStore.utils.addDays(new Date(), 20)),
    },
    field2: {
      key: 'wso_consign_no',
      title: filter('jobNumber'),
      keyItems: [{ key: 'wso_consign_no', title: filter('jobNumber') }],
      val: '',
      op: '=',
    },
    wso_consign_no: {
      key: 'wso_consign_no',
      title: filter('jobNo'),
      val: '',
      op: '=',
      componentProps: {},
      componentType: 'v-text-field',
      more: true,
    },
    wso_house_bill: {
      key: 'wso_house_bill',
      title: filter('hblNo'),
      val: '',
      op: '=',
      componentProps: {},
      componentType: 'v-text-field',
      more: true,
    },
    wso_so_number: {
      key: 'wso_so_number',
      title: filter('soNumber'),
      val: '',
      op: '=',
      componentProps: {},
      componentType: 'v-text-field',
      more: true,
    },
    wso_booking_reference: {
      key: 'wso_booking_reference',
      title: filter('bookingNo'),
      val: '',
      op: '=',
      componentProps: {},
      componentType: 'v-text-field',
      more: true,
    },
    wso_origin: {
      key: 'wso_origin',
      title: filter('origin'),
      val: '',
      op: '=',
      componentProps: {},
      componentType: 'v-text-field',
      more: true,
    },
    wso_destination: {
      key: 'wso_destination',
      title: filter('destination'),
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
  }

  const refTableLayout = ref(null)
  const tblSelected = ref([])
  const tblItems = ref([])
  const pageObj = ref({
    pageSize: 50,
    pageIndex: 1,
  })
  const totalCount = ref(0)

  const tblHeaders = computed(() => [
    { title: header('status'), key: 'wso_status', align: 'start', minWidth: '90px' },
    { title: header('orderNo'), key: 'wso_consign_no', align: 'start', minWidth: '140px' },
    { title: header('soRelease'), key: 'so_release', align: 'start', minWidth: '100px' },
    { title: header('transMode'), key: 'wso_transport_mode', align: 'start', minWidth: '110px' },
    { title: header('container'), key: 'wso_shipment_type', align: 'start', minWidth: '110px' },
    { title: header('houseBill'), key: 'wso_house_bill', align: 'start', minWidth: '120px' },
    { title: header('soNumber'), key: 'wso_so_number', align: 'start', minWidth: '130px' },
    { title: header('bookingRef'), key: 'wso_booking_reference', align: 'start', minWidth: '120px' },
    {
      title: header('descriptionOfGoods'),
      key: 'wso_goods_description',
      align: 'start',
      minWidth: '180px',
      cellProps: { class: 'text-truncate' },
    },
    { title: header('origin'), key: 'wso_origin', align: 'start', minWidth: '100px' },
    { title: header('destination'), key: 'wso_destination', align: 'start', minWidth: '100px' },
    { title: header('targetDelivery'), key: 'wso_delivery_due_date', align: 'start', minWidth: '120px' },
    { title: header('crd'), key: 'wso_cargo_ready', align: 'start', minWidth: '100px' },
    { title: header('etd'), key: 'wso_etd', align: 'start', minWidth: '100px' },
    { title: header('eta'), key: 'wso_eta', align: 'start', minWidth: '100px' },
    { title: header('grossWeight'), key: 'wso_actual_weight', align: 'end', minWidth: '140px' },
    { title: header('cbm'), key: 'wso_actual_volume', align: 'end', minWidth: '100px' },
    { title: header('chargeable'), key: 'wso_actual_chargeable', align: 'end', minWidth: '100px' },
    { title: header('packages'), key: 'wso_total_package_count', align: 'end', minWidth: '100px' },
    { title: header('createUser'), key: 'create_user', align: 'start', minWidth: '100px' },
    { title: header('modifyUser'), key: 'last_modify_user', align: 'start', minWidth: '100px' },
  ])

  const buildListFilters = () => {
    const vvv = [
      {
        key: inputSearchData.value.field1.key,
        op: 'between',
        val: '',
        start: inputSearchData.value.field1.start,
        end: inputSearchData.value.field1.end,
      },
      { key: inputSearchData.value.field2.key, op: '=', val: inputSearchData.value.field2.val },
    ]

    Object.keys(inputSearchData.value).forEach(key => {
      const ee = inputSearchData.value[key]
      if (ee?.more) {
        vvv.push({ key: ee.key, op: ee.op, val: ee.val })
      }
    })

    return vvv
  }

  const mapWhsOrderRow = (item, index) => mapWhsOrderListRow(item, index)

  const queryData = async () => {
    cardLoading.value = true
    try {
      const { success, data } = await whsOrderQueryPage({
        filters: buildListFilters(),
        skipCount: (pageObj.value.pageIndex - 1) * pageObj.value.pageSize,
        maxResultCount: pageObj.value.pageSize,
      })

      skeletonLoading.value = false
      if (success && data) {
        const items = data.items ?? []
        tblItems.value = items.map((item, index) =>
          mapWhsOrderRow(item, (pageObj.value.pageIndex - 1) * pageObj.value.pageSize + index + 1),
        )
        totalCount.value = data.totalCount ?? 0
      } else {
        tblItems.value = []
        totalCount.value = 0
      }

      nextTick(() => {
        if (refTableLayout.value) {
          refTableLayout.value.initHeaders()
          refTableLayout.value.initScrollListener()
        }
      })
    } catch (error) {
      console.error(error)
      skeletonLoading.value = false
    } finally {
      cardLoading.value = false
    }
  }
  queryData()

  function onRowDblClick(event, { item }) {
    if (event.target.closest('.v-selection-control, button, a, input, textarea, [role="button"]'))
      return
    router.push({
      name: 'warehouse_booking_edit-pk',
      params: { pk: item.pk },
      query: { id: item.id, shipment_no: item.wso_consign_no },
    })
  }

  const onNewOrder = () => {
    router.push({ name: 'warehouse_booking_new' })
  }

  const importDialogOpen = ref(false)
  const importLoading = ref(false)

  const onImportUpload = async ({ files }) => {
    if (!files?.length) {
      appStore.openMessage({
        content: importI18n('noFile'),
        color: 'warning',
      })
      return
    }

    importLoading.value = true
    try {
      appStore.openGlobalLoadingWithIcon(importI18n('uploading'), '$upload', 'info')
      const formData = new FormData()
      formData.append('file', files[0])
      const { success, data } = await recognizeWhsBookingFile(formData)
      const order = Array.isArray(data?.orders) ? data.orders[0] : null
      if (!success || !order || typeof order !== 'object') {
        throw new Error(importI18n('missingData'))
      }

      sessionStorage.setItem(WHS_ORDER_RECOGNIZE_STORAGE_KEY, JSON.stringify(order))
      importDialogOpen.value = false
      router.push({
        name: 'warehouse_booking_new',
        query: { source: 'recognize' },
      })
    } catch (error) {
      console.error(error)
      appStore.openMessage({
        content: error.message || importI18n('failed'),
        color: 'error',
      })
    } finally {
      importLoading.value = false
      appStore.closeGlobalLoading()
    }
  }
</script>

<style lang="scss" scoped>
  .table-layout {
    :deep(.table-filter) {
      .v-table__wrapper {
        th.v-data-table__th--sticky {
          left: 72px;
        }
        th:nth-child(1) {
          left: 0;
          z-index: 2;
        }
        th:nth-child(2) {
          left: 36px;
          z-index: 2;
        }
        td:nth-child(1) {
          position: sticky;
          left: 0;
          z-index: 1;
        }
        td:nth-child(2) {
          position: sticky;
          left: 36px;
          z-index: 1;
        }
        th:nth-child(1),
        th:nth-child(2) {
          background-color: rgb(var(--v-theme-surface));
        }
        td:nth-child(1),
        td:nth-child(2) {
          background-color: rgb(var(--v-theme-surface));
        }
        .v-data-table__tr:nth-child(even) {
          td:nth-child(1),
          td:nth-child(2) {
            background-image: linear-gradient(
              0deg,
              rgba(var(--v-border-color), var(--v-hover-opacity)),
              rgba(var(--v-border-color), var(--v-hover-opacity))
            );
          }
        }
      }
    }
  }
</style>
