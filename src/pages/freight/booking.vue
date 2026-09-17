<template>
  <FPageLayout :card-loading="cardLoading" :skeleton-loading="skeletonLoading">
    <template #filter>
      <div ref="refFilter">
        <PageFilterBar
          v-model:input-search-data="inputSearchData"
          @on-reset-more="onResetMore"
          @on-search="queryData"
        >
          <v-col :cols="rescols('c12m4s6')">
            <div class="d-flex align-center ga-1">
              <v-select
                v-model="inputSearchData.field1.key"
                auto-select-first
                density="compact"
                hide-details
                item-title="title"
                item-value="key"
                :items="inputSearchData.field1.keyItems"
                variant="underlined"
                width="70"
              />

              <FDatePicker
                v-model:date-value="inputSearchData.field1.start"
                :date-props="{ placeholder: list('startDate'), clearable: false }"
                :max="inputSearchData.field1.end ?? '2099-12-31'"
                min="2000-01-01"
                min-width="auto"
                width="100"
              />
              -
              <FDatePicker
                v-model:date-value="inputSearchData.field1.end"
                :date-props="{ placeholder: list('endDate'), clearable: false }"
                max="2099-12-31"
                :min="inputSearchData.field1.start ?? '2000-01-01'"
                min-width="auto"
                width="100"
              />
            </div>
          </v-col>

          <v-col :cols="rescols('c12m4s6')">
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
                :placeholder="tableHeader('bookingNo')"
                variant="outlined"
              />
            </div>
          </v-col>
        </PageFilterBar>

        <v-card-text class="booking-status-filter py-2">
          <div class="d-flex align-center flex-wrap ga-2">
            <div class="d-flex align-center text-caption text-medium-emphasis">
              <span>{{ list('status') }}</span>
              <v-icon class="ml-1" icon="mdi-information-outline" size="14" />
            </div>

            <div class="d-flex align-center flex-wrap booking-status-toggle">
              <v-btn
                v-for="status in statusOptions"
                :key="status.value"
                :color="isStatusSelected(status.value) ? 'primary' : 'default'"
                size="small"
                :variant="isStatusSelected(status.value) ? 'flat' : 'tonal'"
                @click="toggleStatus(status.value)"
              >
                {{ status.title }}
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </div>
    </template>

    <FTableLayout
      ref="refTableLayout"
      v-model="tblSelected"
      class="table-layout"
      :headers="tblHeaders"
      :items="tblItems"
      :max-height="maxHeight"
      setting-name="EBOOKING_BOOKING_TBL"
      striped="even"
      :title="list('pageTitle')"
      virtual
      @row-dblclick="onRowDblClick"
    >
      <template #actions>
        <v-btn
          color="primary"
          prepend-icon="$plus"
          size="small"
          variant="flat"
          @click="router.push({ name: 'booking_new' })"
        >
          {{ list('new') }}
        </v-btn>
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

      <template #item.booking_status="{ item }">
        <v-chip
          v-if="item.booking_status"
          size="small"
          v-bind="getBookingListStatusChipProps(item.booking_status)"
        >
          {{ displayBookingStatus(item.booking_status) }}
        </v-chip>
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
  </FPageLayout>
</template>

<script setup>
  import { computed, nextTick, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useDisplay } from 'vuetify'

  import { bookingQueryPage } from '@/api/booking'
  import { debounceFn } from '@/api/utils'
  import FPageLayout from '@/components/FPageLayout.vue'
  import FTableLayout from '@/components/FTableLayout.vue'
  import PageFilterBar from '@/components/PageFilterBar.vue'
  import {
    buildBookingListFilters,
    buildBookingStatusFilters,
    mapBookingListRow,
  } from '@/composables/mapEbookingBooking'
  import { useBookingPageI18n } from '@/composables/useBookingPageI18n'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import {
    BOOKING_LIST_STATUS_OPTIONS,
    defaultBookingListStatusSelection,
    getBookingListStatusChipProps,
  } from '@/constants/bookingListStatus'
  import { isSiSubmittedOrLater } from '@/constants/bookingFreightSteps'
  import { useAppStore } from '@/stores/app'

  defineOptions({ name: 'Booking' })
  definePage({
    name: 'booking',
    icon: 'mdi-clipboard-text-outline',
    menu: true,
    order: 1,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      permissions: 'PERMISSION_FREIGHT_BOOKING',
    },
  })

  const router = useRouter()
  const display = useDisplay()
  const appStore = useAppStore()
  const { rescols } = useLayoutCols()
  const { list, tableHeader, menu, listStatus } = useBookingPageI18n()

  const contentHeight = computed(() => display.height.value - 65 - 35)
  const refFilter = ref(null)
  const maxHeight = computed(() => {
    return contentHeight.value - (refFilter.value?.clientHeight ?? 0) - 12 - 52 - 14
  })

  const skeletonLoading = ref(true)
  const cardLoading = ref(false)
  const refTableLayout = ref(null)
  const tblSelected = ref([])
  const tblItems = ref([])
  const totalCount = ref(0)
  const pageObj = ref({ pageSize: 2000, pageIndex: 1 })
  const selectedStatuses = ref(defaultBookingListStatusSelection())
  const statusOptions = computed(() =>
    BOOKING_LIST_STATUS_OPTIONS.map(item => ({
      ...item,
      title: listStatus(item.value),
    })),
  )

  const displayBookingStatus = status => {
    if (!status) {
      return ''
    }
    const matched = BOOKING_LIST_STATUS_OPTIONS.find(item => item.value === status)
    return matched ? listStatus(matched.value) : status
  }

  const defaultSearchData = () => ({
    field1: {
      key: 'bkg_etd',
      title: tableHeader('etd'),
      keyItems: [
        { key: 'bkg_etd', title: tableHeader('etd') },
        { key: 'bkg_cargo_ready', title: tableHeader('crd') },
      ],
      start: appStore.utils.formatDate(appStore.utils.addDays(new Date(), -20)),
      end: appStore.utils.formatDate(appStore.utils.addDays(new Date(), 20)),
    },
    field2: {
      key: 'bkg_consign_no',
      title: tableHeader('bookingNo'),
      keyItems: [{ key: 'bkg_consign_no', title: tableHeader('bookingNo') }],
      val: '',
    },
  })

  const inputSearchData = ref(defaultSearchData())

  const onResetMore = () => {
    inputSearchData.value = defaultSearchData()
    selectedStatuses.value = defaultBookingListStatusSelection()
    queryData()
  }

  const isStatusSelected = value => selectedStatuses.value.includes(value)

  const queryDataByStatus = debounceFn(() => {
    pageObj.value.pageIndex = 1
    queryData()
  }, 1000)

  const toggleStatus = value => {
    if (isStatusSelected(value)) {
      selectedStatuses.value = selectedStatuses.value.filter(item => item !== value)
    } else {
      selectedStatuses.value = [...selectedStatuses.value, value]
    }
    queryDataByStatus()
  }

  const tblHeaders = computed(() => [
    { title: '', key: 'actions', align: 'center', sortable: false, width: '36px' },
    { title: tableHeader('bookingNo'), key: 'bkg_consign_no', align: 'start', minWidth: '140px' },
    { title: tableHeader('status'), key: 'bkg_status', align: 'start', minWidth: '100px' },
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
    // { title: 'Shipment No.', key: 'bkg_consign_no', align: 'start', minWidth: '140px' },
    { title: tableHeader('houseBill'), key: 'bkg_house_bill', align: 'start', minWidth: '120px' },
    {
      title: tableHeader('shipperName'),
      key: 'shipper_name',
      align: 'start',
      minWidth: '140px',
      maxWidth: '200px',
      cellProps: { class: 'text-truncate' },
    },
    {
      title: tableHeader('consigneeName'),
      key: 'consignee_name',
      align: 'start',
      minWidth: '140px',
      maxWidth: '200px',
      cellProps: { class: 'text-truncate' },
    },
    { title: tableHeader('origin'), key: 'bkg_origin', align: 'start', minWidth: '100px' },
    {
      title: tableHeader('destination'),
      key: 'bkg_destination',
      align: 'start',
      minWidth: '100px',
    },
    { title: tableHeader('crd'), key: 'bkg_cargo_ready', align: 'start', minWidth: '100px' },
    { title: tableHeader('etd'), key: 'bkg_etd', align: 'start', minWidth: '100px' },
    { title: tableHeader('eta'), key: 'bkg_eta', align: 'start', minWidth: '100px' },
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

  const getRowMenuItems = item => {
    const items = [{ title: menu('copy'), prependIcon: 'mdi-content-copy', code: 'copy' }]
    const status = item?.active_status || item?.booking_status || item?.bkg_status
    if (!isSiSubmittedOrLater(status)) {
      items.push(
        { type: 'divider' },
        { title: menu('deactivate'), prependIcon: 'mdi-delete', code: 'deactivate', color: 'red' },
      )
    }
    return items
  }

  const handleRowMenuSelect = (e, item) => {
    switch (e.id) {
      case 'copy': {
        router.push({
          name: 'booking_edit-pk',
          params: { pk: item.pk },
          query: { id: item.id, shipment_no: item.bkg_consign_no, copy: '1' },
        })
        return
      }
      case 'deactivate': {
        console.log('deactivate', item)
        return
      }
      default: {
        break
      }
    }
  }

  const queryData = async () => {
    cardLoading.value = true
    try {
      const { success, data } = await bookingQueryPage({
        filters: [
          ...buildBookingListFilters(inputSearchData.value),
          ...buildBookingStatusFilters(selectedStatuses.value, BOOKING_LIST_STATUS_OPTIONS.length),
        ],
        skipCount: (pageObj.value.pageIndex - 1) * pageObj.value.pageSize,
        maxResultCount: pageObj.value.pageSize,
      })

      skeletonLoading.value = false
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
      skeletonLoading.value = false
    } finally {
      cardLoading.value = false
    }
  }

  function onRowDblClick(event, { item }) {
    if (event.target.closest('.v-selection-control, button, a, input, textarea, [role="button"]'))
      return
    router.push({
      name: 'booking_edit-pk',
      params: { pk: item.pk },
      query: { id: item.id, shipment_no: item.bkg_consign_no },
    })
  }

  queryData()
</script>

<style lang="scss" scoped>
  .booking-status-filter {
    border-top: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
  }

  .booking-status-toggle {
    flex-wrap: wrap;
    gap: 8px;
  }

  .booking-status-btn {
    min-width: auto;
    letter-spacing: normal;
  }

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
