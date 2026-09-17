<template>
  <v-sheet class="dashboard-page pa-3" color="transparent">
    <v-progress-linear :active="loading" color="primary" height="2" indeterminate />

    <v-row class="dashboard-page__layout">
      <v-col class="dashboard-page__col" cols="12" md="6">
        <v-row class="dashboard-page__stats">
          <v-col v-for="card in leftCards" :key="card.key" cols="6">
            <DashboardStatCard
              :title="card.title"
              :value="card.value"
              @click="goBookingList(card.key)"
            />
          </v-col>
        </v-row>

        <v-row class="dashboard-page__panel-row">
          <v-col cols="12">
            <DashboardLatestTransactions
              :empty-text="d('emptyTransactions')"
              :items="transactionItems"
              :title="d('latestTransactions')"
              @select="openBooking"
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col class="dashboard-page__col" cols="12" md="6">
        <v-row class="dashboard-page__stats">
          <v-col v-for="card in rightCards" :key="card.key" cols="6">
            <DashboardStatCard
              :title="card.title"
              :value="card.value"
              @click="goBookingList(card.key)"
            />
          </v-col>
        </v-row>

        <v-row class="dashboard-page__panel-row">
          <v-col cols="12">
            <DashboardBookingAnalysis
              v-model:period="analysisPeriod"
              :empty-text="d('emptyAnalysis')"
              :period-items="periodItems"
              :segments="analysis.segments"
              :summaries="analysisSummaries"
              :title="d('bookingAnalysis')"
              :total="analysis.total"
              :total-label="d('total')"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup>
  import { computed, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useLocale } from 'vuetify'
  import { useDashboardData } from '@/composables/useDashboardData'
  import { DASHBOARD_CARD_STATUS_MAP } from '@/constants/bookingListStatus'

  defineOptions({
    name: 'Dashboard',
  })

  definePage({
    name: 'dashboard',
    icon: 'mdi-view-dashboard-outline',
    menu: true,
    order: 0,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
    },
  })

  const { t } = useLocale()
  const router = useRouter()
  const {
    loading,
    cardCounts,
    latestTransactions,
    periodCounts,
    analysis,
    loadData,
    formatBookingNo,
    itemTimestamp,
    CARD_KEYS,
  } = useDashboardData()

  const d = key => t(`$vuetify.custom.dashboardPage.${key}`)
  const cardTitle = key => t(`$vuetify.custom.dashboardPage.cards.${key}`)
  const analysisPeriod = ref('lastMonth')

  const statCards = computed(() =>
    CARD_KEYS.map(key => ({
      key,
      title: cardTitle(key),
      value: cardCounts.value[key] ?? 0,
    })),
  )
  const leftCards = computed(() => statCards.value.slice(0, 2))
  const rightCards = computed(() => statCards.value.slice(2, 4))

  const periodItems = computed(() => [
    { value: 'lastMonth', title: d('lastMonth') },
    { value: 'last3Months', title: d('last3Months') },
    { value: 'thisYear', title: d('thisYear') },
    { value: 'all', title: d('all') },
  ])

  const analysisSummaries = computed(() => [
    { key: 'daily', label: d('daily'), value: periodCounts.value.daily },
    { key: 'weekly', label: d('weekly'), value: periodCounts.value.weekly },
    { key: 'monthly', label: d('monthly'), value: periodCounts.value.monthly },
  ])

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const formatTxnDate = timestamp => {
    if (!timestamp) {
      return '—'
    }
    const date = new Date(timestamp)
    const today = new Date()
    const isToday =
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    if (isToday) {
      return d('today')
    }
    return `${MONTHS[date.getMonth()]} ${date.getDate()}`
  }

  const formatCbm = item => {
    const cbm = item.bkg_actual_volume
    if (cbm !== null && cbm !== undefined && cbm !== '') {
      return `${cbm} CBM`
    }
    return '—'
  }

  const transactionItems = computed(() =>
    latestTransactions.value.map(item => ({
      ...item,
      dateLabel: formatTxnDate(itemTimestamp(item)),
      title: formatBookingNo(item),
      container: item.container_summary || '—',
      cbm: formatCbm(item),
    })),
  )

  const goBookingList = key => {
    const status = DASHBOARD_CARD_STATUS_MAP[key]
    router.push({
      name: 'booking',
      query: status ? { status } : {},
    })
  }

  const openBooking = item => {
    if (!item?.pk || String(item.pk).startsWith('mock-')) {
      return
    }
    router.push({
      name: 'booking_edit-pk',
      params: { pk: item.pk },
      query: { id: item.id, shipment_no: item.bkg_consign_no },
    })
  }

  watch(analysisPeriod, period => {
    loadData(period)
  }, { immediate: true })
</script>

<style lang="scss" scoped>
  .dashboard-page {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100dvh - 112px);
    max-height: calc(100dvh - 112px);
    overflow: hidden;
  }

  .dashboard-page__layout {
    flex: 1 1 0%;
    min-height: 0;
    margin-bottom: 0;
  }

  .dashboard-page__col {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  .dashboard-page__stats {
    flex: 0 0 auto;
  }

  .dashboard-page__panel-row {
    flex: 1 1 0%;
    min-height: 0;
    margin-bottom: 0;
  }

  .dashboard-page__panel-row :deep(.v-col) {
    display: flex;
    height: 100%;
    min-height: 0;
  }
</style>
