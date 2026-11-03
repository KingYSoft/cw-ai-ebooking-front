<template>
  <v-card border class="dashboard-booking-list" elevation="0" rounded="xl">
    <div class="dashboard-booking-list__header">
      <h2 class="dashboard-booking-list__title">{{ title }}</h2>
    </div>

    <FTableLayout
      ref="refTableLayout"
      v-model="tblSelected"
      :headers="tblHeaders"
      :items="tblItems"
      :max-height="420"
      setting-name="EBOOKING_DASHBOARD_BOOKING_TBL"
      striped="even"
      virtual
      @row-dblclick="onRowDblClick"
    >
      <template #item.creationTime="{ item }">
        {{ formatCreationDate(item.creationTime) }}
      </template>

      <template #item.bkg_consign_no="{ item }">
        <button
          v-if="item.bkg_consign_no"
          class="booking-ref-link"
          type="button"
          @click.stop="openBookingDetail(item)"
        >
          {{ item.bkg_consign_no }}
        </button>
      </template>

      <template #item.bkg_status="{ item }">
        <StatusBadge :text="displayBookingStatus(item.bkg_status)" :tone-key="item.bkg_status" />
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
  </v-card>
</template>

<script setup>
  import { computed, nextTick, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { bookingQueryPage } from '@/api/booking'
  import FDataTableFooter from '@/components/FDataTableFooter.vue'
  import FTableLayout from '@/components/FTableLayout.vue'
  import StatusBadge from '@/components/StatusBadge.vue'
  import { mapBookingListRow } from '@/composables/mapEbookingBooking'
  import { useBookingPageI18n } from '@/composables/useBookingPageI18n'
  import { BOOKING_LIST_STATUS_OPTIONS } from '@/constants/bookingListStatus'
  import { useAppStore } from '@/stores/app'

  defineOptions({
    name: 'DashboardBookingList',
  })

  defineProps({
    title: {
      type: String,
      required: true,
    },
  })

  const router = useRouter()
  const appStore = useAppStore()
  const { tableHeader, listStatus } = useBookingPageI18n()

  const refTableLayout = ref(null)
  const tblSelected = ref([])
  const tblItems = ref([])
  const totalCount = ref(0)
  const pageObj = ref({ pageSize: 50, pageIndex: 1 })

  const displayBookingStatus = status => {
    if (!status) {
      return ''
    }
    const matched = BOOKING_LIST_STATUS_OPTIONS.find(item => item.value === status)
    return matched ? listStatus(matched.labelKey) : status
  }

  const formatCreationDate = value => {
    if (!value) {
      return '—'
    }
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value.slice(0, 10)
    }
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      return '—'
    }
    return appStore.utils.formatDate(date)
  }

  const tblHeaders = computed(() => [
    {
      title: tableHeader('date'),
      key: 'creationTime',
      align: 'start',
      width: '112px',
      minWidth: '112px',
    },
    {
      title: tableHeader('bookingNo'),
      key: 'bkg_consign_no',
      align: 'start',
      width: '140px',
      minWidth: '140px',
    },
    { title: tableHeader('status'), key: 'bkg_status', align: 'start', minWidth: '140px' },
    { title: tableHeader('origin'), key: 'bkg_origin', align: 'start', minWidth: '100px' },
    {
      title: tableHeader('destination'),
      key: 'bkg_destination',
      align: 'start',
      minWidth: '100px',
    },
    {
      title: tableHeader('transMode'),
      key: 'bkg_transport_mode',
      align: 'start',
      minWidth: '120px',
    },
    {
      title: tableHeader('containerMode'),
      key: 'bkg_packing_mode',
      align: 'start',
      minWidth: '140px',
    },
    { title: tableHeader('houseBill'), key: 'bkg_house_bill', align: 'start', minWidth: '170px' },
    {
      title: tableHeader('shipperName'),
      key: 'shipper_name',
      align: 'start',
      minWidth: '140px',
    },
    {
      title: tableHeader('consigneeName'),
      key: 'consignee_name',
      align: 'start',
      minWidth: '140px',
    },
    { title: tableHeader('crd'), key: 'bkg_cargo_ready', align: 'start', minWidth: '112px' },
    { title: tableHeader('etd'), key: 'bkg_etd', align: 'start', minWidth: '112px' },
    { title: tableHeader('eta'), key: 'bkg_eta', align: 'start', minWidth: '112px' },
    {
      title: tableHeader('grossWeight'),
      key: 'bkg_actual_weight',
      align: 'start',
      minWidth: '120px',
    },
    { title: tableHeader('cbm'), key: 'bkg_actual_volume', align: 'start', minWidth: '80px' },
    {
      title: tableHeader('freightTerm'),
      key: 'bkg_freight_terms',
      align: 'start',
      minWidth: '120px',
    },
    { title: tableHeader('inco'), key: 'bkg_inco', align: 'start', minWidth: '80px' },
  ])

  const queryData = async () => {
    try {
      const { success, data } = await bookingQueryPage({
        filters: [],
        skipCount: (pageObj.value.pageIndex - 1) * pageObj.value.pageSize,
        maxResultCount: pageObj.value.pageSize,
      })

      if (success && data) {
        const items = data.items ?? []
        tblItems.value = items.map((item, index) =>
          mapBookingListRow(
            item,
            (pageObj.value.pageIndex - 1) * pageObj.value.pageSize + index + 1,
          ),
        )
        totalCount.value = data.totalCount || 0
      } else {
        tblItems.value = []
        totalCount.value = 0
      }

      nextTick(() => {
        refTableLayout.value?.initHeaders?.()
        refTableLayout.value?.initScrollListener?.()
      })
    } catch (error) {
      console.log(error)
    }
  }

  function openBookingDetail(item) {
    if (!item?.pk) {
      return
    }
    router.push({
      name: 'booking_edit-pk',
      params: { pk: item.pk },
      query: { id: item.id, shipment_no: item.bkg_consign_no },
    })
  }

  function onRowDblClick(event, { item }) {
    if (event.target.closest('.v-selection-control, button, a, input, textarea, [role="button"]')) {
      return
    }
    openBookingDetail(item)
  }

  queryData()
</script>

<style lang="scss" scoped>
  .dashboard-booking-list {
    padding: 24px;
    overflow: visible;
    flex-shrink: 0;
  }

  .dashboard-booking-list :deep(.table-filter) {
    tbody td {
      position: static;
      left: auto;
    }

    th {
      left: auto;
    }
  }

  .dashboard-booking-list :deep(.fixed-table-cc .v-table__wrapper) {
    th:nth-child(2),
    td:nth-child(2) {
      box-shadow: none;
    }
  }

  .dashboard-booking-list__header {
    margin-bottom: 8px;
  }

  .dashboard-booking-list__title {
    color: #0f172a;
    font-size: 1.125rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.3;
  }

  .dashboard-booking-list :deep(.v-toolbar),
  .dashboard-booking-list :deep(.v-toolbar + .v-divider) {
    display: none;
  }

  .booking-ref-link {
    padding: 0;
    border: 0;
    background: transparent;
    color: #0e7490;
    font-size: 12px;
    font-weight: 700;
    text-align: left;
    cursor: pointer;
  }

  .booking-ref-link:hover {
    text-decoration: underline;
  }
</style>
