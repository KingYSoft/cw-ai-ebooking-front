<template>
  <v-sheet class="dashboard-page pa-3" color="transparent">
    <v-progress-linear :active="loading" color="primary" height="2" indeterminate />

    <v-row class="dashboard-page__stats">
      <v-col v-for="card in statCards" :key="card.key" cols="12" sm="6" lg="3">
        <DashboardStatCard :title="card.title" :value="card.value" @click="goBookingList" />
      </v-col>
    </v-row>

    <v-row class="dashboard-page__bottom">
      <v-col class="dashboard-page__bottom-col d-flex flex-column" cols="12" md="6">
        <DashboardLatestTransactions
          :empty-text="d('emptyTransactions')"
          :items="transactionItems"
          :title="d('latestTransactions')"
          @select="openBooking"
        />
      </v-col>

      <v-col class="dashboard-page__bottom-col d-flex flex-column" cols="12" md="6">
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
  </v-sheet>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useLocale } from 'vuetify'
  import { useDashboardData } from '@/composables/useDashboardData'

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
    analysisByPeriod,
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

  const analysis = computed(() => analysisByPeriod(analysisPeriod.value))

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
    latestTransactions.value.map(item => {
      const consignee = item.consignee_name || item.consignee?.add_address_name || ''
      return {
        ...item,
        dateLabel: formatTxnDate(itemTimestamp(item)),
        title: formatBookingNo(item),
        subtitle: consignee || '—',
        container: item.container_summary || '—',
        cbm: formatCbm(item),
      }
    }),
  )

  const goBookingList = () => {
    router.push({ name: 'booking' })
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

  loadData()
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

  .dashboard-page__stats {
    flex: 0 0 auto;
  }

  .dashboard-page__bottom {
    flex: 1 1 0%;
    min-height: 0;
    width: 100%;
    overflow: hidden;
  }

  .dashboard-page__bottom-col {
    height: 100%;
    max-height: 100%;
    min-height: 0;
    overflow: hidden;
  }
</style>
