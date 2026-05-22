<template>
  <FPageLayout :card-loading="cardLoading" :skeleton-loading="skeletonLoading">
    <template #filter>
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
              width="60"
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
              placeholder="Job Number"
              variant="outlined"
            />
          </div>
        </v-col>
      </PageFilterBar>
    </template>

    <FTableLayout
      ref="refTableLayout"
      :headers="tblHeaders"
      :items="tblItems"
      :max-height="maxHeight"
      setting-name="EBOOKING_BOOKING_TBL"
      striped="even"
      title="Booking Details"
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
          New
        </v-btn>
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

  import FPageLayout from '@/components/FPageLayout.vue'
  import FTableLayout from '@/components/FTableLayout.vue'
  import PageFilterBar from '@/components/PageFilterBar.vue'
  import { useLayoutCols } from '@/composables/useLayoutCols'
  import { queryMockBookings } from '@/mock/booking'
  import { useAppStore } from '@/stores/app'

  defineOptions({ name: 'Booking' })
  definePage({
    name: 'booking',
    icon: 'mdi-clipboard-text-outline',
    menu: true,
    order: 1,
    meta: {
      keepAlive: true,
      requiresAuth: true,
      isLayout: true,
    },
  })

  const router = useRouter()
  const display = useDisplay()
  const appStore = useAppStore()
  const { rescols } = useLayoutCols()

  const contentHeight = computed(() => display.height.value - 65 - 35)
  const maxHeight = computed(() => contentHeight.value - 12 - 52 - 14 - 80)

  const skeletonLoading = ref(true)
  const cardLoading = ref(false)
  const refTableLayout = ref(null)
  const tblItems = ref([])
  const totalCount = ref(0)
  const pageObj = ref({ pageSize: 2000, pageIndex: 1 })

  const defaultSearchData = () => ({
    field1: {
      key: 'bkg_etd',
      title: 'ETD',
      keyItems: [{ key: 'bkg_etd', title: 'ETD' }],
      start: appStore.utils.formatDate(appStore.utils.addDays(new Date(), -20)),
      end: appStore.utils.formatDate(appStore.utils.addDays(new Date(), 20)),
    },
    field2: {
      key: 'bkg_consign_no',
      title: 'Job Number',
      keyItems: [{ key: 'bkg_consign_no', title: 'Job Number' }],
      val: '',
    },
  })

  const inputSearchData = ref(defaultSearchData())

  const onResetMore = () => {
    inputSearchData.value = defaultSearchData()
  }

  const tblHeaders = [
    { title: 'Trans Mode', key: 'bkg_transport_mode', align: 'start', minWidth: '90px' },
    { title: 'Container Mode', key: 'bkg_packing_mode', align: 'start', minWidth: '110px' },
    { title: 'Status', key: 'job_status', align: 'start', minWidth: '80px' },
    { title: 'Shipment No.', key: 'bkg_consign_no', align: 'start', minWidth: '140px' },
    { title: 'House Bill', key: 'bkg_house_bill', align: 'start', minWidth: '120px' },
    {
      title: 'Shipper Name',
      key: 'shipper_name',
      align: 'start',
      minWidth: '140px',
      maxWidth: '200px',
      cellProps: { class: 'text-truncate' },
    },
    {
      title: 'Consignee Name',
      key: 'consignee_name',
      align: 'start',
      minWidth: '140px',
      maxWidth: '200px',
      cellProps: { class: 'text-truncate' },
    },
    { title: 'Origin', key: 'bkg_origin', align: 'start', minWidth: '100px' },
    { title: 'Destination', key: 'bkg_destination', align: 'start', minWidth: '100px' },
    { title: 'CRD', key: 'bkg_cargo_ready', align: 'start', minWidth: '100px' },
    { title: 'ETD', key: 'bkg_etd', align: 'start', minWidth: '100px' },
    { title: 'ETA', key: 'bkg_eta', align: 'start', minWidth: '100px' },
    { title: 'Gross Weight', key: 'bkg_actual_weight', align: 'start', minWidth: '110px' },
    { title: 'CBM', key: 'bkg_actual_volume', align: 'start', minWidth: '80px' },
    { title: 'Freight Term', key: 'bkg_freight_terms', align: 'start', minWidth: '100px' },
    { title: 'Inco', key: 'bkg_inco', align: 'start', minWidth: '80px' },
  ]

  const queryData = async () => {
    cardLoading.value = true
    try {
      const data = queryMockBookings({
        skipCount: (pageObj.value.pageIndex - 1) * pageObj.value.pageSize,
        maxResultCount: pageObj.value.pageSize,
      })

      skeletonLoading.value = false
      tblItems.value = data.items
      totalCount.value = data.totalCount

      nextTick(() => {
        refTableLayout.value?.initHeaders?.()
        refTableLayout.value?.initScrollListener?.()
      })
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
    })
  }

  queryData()
</script>
