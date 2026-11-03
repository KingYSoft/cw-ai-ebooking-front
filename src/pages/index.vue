<template>
  <v-sheet class="dashboard-page pa-8" color="transparent">
    <v-progress-linear :active="loading" color="primary" height="2" indeterminate />

    <div class="dashboard-page__header">
      <div>
        <h1 class="dashboard-page__title">{{ d('pageTitle') }}</h1>
        <p class="dashboard-page__subtitle">{{ d('pageSubtitle') }}</p>
      </div>

      <div class="dashboard-page__controls">
        <v-btn
          class="dashboard-page__new"
          color="primary"
          prepend-icon="$plus"
          size="small"
          variant="flat"
          @click="goNewBooking"
        >
          {{ d('newBooking') }}
        </v-btn>

        <v-btn
          class="dashboard-page__export"
          elevation="0"
          prepend-icon="mdi-download"
          size="small"
          variant="flat"
          @click="exportReport"
        >
          {{ d('exportReport') }}
        </v-btn>
      </div>
    </div>

    <v-row>
      <v-col v-for="card in kpiCards" :key="card.key" cols="12" md="4">
        <DashboardStatCard
          :more-label="d('moreDetails')"
          :title="card.title"
          :unit="card.unit"
          :value="card.value"
          @click="goBookingList(card.key)"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="5">
        <DashboardBookingAnalysis
          :empty-text="d('emptyAnalysis')"
          :segments="analysis.segments"
          :subtitle="d('clientsSubtitle')"
          :title="d('clientsTitle')"
          :total="analysis.total"
          :total-label="d('total')"
        />
      </v-col>

      <v-col cols="12" md="7">
        <DashboardMonthlyVolume
          :legend="d('monthlyLegend')"
          :metrics="monthlyMetrics"
          :subtitle="d('monthlySubtitle')"
          :title="d('monthlyTitle')"
        />
      </v-col>
    </v-row>

    <DashboardBookingList :title="d('fullListTitle')" />
  </v-sheet>
</template>

<script setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useLocale } from 'vuetify'
  import DashboardBookingAnalysis from '@/components/dashboard/DashboardBookingAnalysis.vue'
  import DashboardBookingList from '@/components/dashboard/DashboardBookingList.vue'
  import DashboardMonthlyVolume from '@/components/dashboard/DashboardMonthlyVolume.vue'
  import DashboardStatCard from '@/components/dashboard/DashboardStatCard.vue'
  import { useDashboardData } from '@/composables/useDashboardData'
  import { DASHBOARD_CARD_STATUS_MAP } from '@/constants/bookingListStatus'
  import { DASHBOARD_MOCK_MONTHLY } from '@/constants/dashboardMock'
  import { useAppStore } from '@/stores/app'

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
  const appStore = useAppStore()
  const { loading, analysis, cardCounts, loadData } = useDashboardData()

  const d = key => t(`$vuetify.custom.dashboardPage.${key}`)

  const kpiCards = computed(() => [
    {
      key: 'pendingSubmit',
      title: d('cards.pendingSubmit'),
      value: cardCounts.value.pendingSubmit,
    },
    {
      key: 'waitingApproval',
      title: d('cards.waitingApproval'),
      value: cardCounts.value.waitingApproval,
    },
    {
      key: 'pendingSi',
      title: d('cards.pendingSi'),
      value: cardCounts.value.pendingSi,
    },
  ])

  const goBookingList = key => {
    const status = DASHBOARD_CARD_STATUS_MAP[key]
    router.push({
      name: 'booking',
      query: status ? { status } : {},
    })
  }

  const goNewBooking = () => {
    router.push({ name: 'booking_new' })
  }

  const monthlyMetrics = computed(() => [
    { label: d('peakMonth'), value: DASHBOARD_MOCK_MONTHLY.peak },
    { label: d('avgMonthly'), value: DASHBOARD_MOCK_MONTHLY.avg },
    { label: d('totalYtd'), value: DASHBOARD_MOCK_MONTHLY.ytd, accent: true },
  ])

  const exportReport = () => {
    appStore.openMessage({
      content: d('exportMock'),
      color: 'info',
    })
  }

  loadData('lastMonth')
</script>

<style lang="scss" scoped>
  .dashboard-page {
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    max-height: calc(100dvh - 112px);
    overflow-y: auto;
  }

  .dashboard-page > * {
    flex-shrink: 0;
  }

  .dashboard-page__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .dashboard-page__title {
    color: #0f172a;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.25;
  }

  .dashboard-page__subtitle {
    color: #64748b;
    font-size: 0.75rem;
    margin-top: 2px;
  }

  .dashboard-page__controls {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .dashboard-page__new {
    height: 36px;
    min-height: 36px;
    padding: 0 16px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0;
    text-transform: none;
  }

  .dashboard-page__export {
    height: 36px;
    min-height: 36px;
    padding: 0 16px;
    background: #fff !important;
    color: #334155 !important;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0;
    text-transform: none;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: none;
  }

  .dashboard-page__export:hover {
    background: #f8fafc !important;
  }

  .dashboard-page__export :deep(.v-icon) {
    color: #94a3b8;
    font-size: 16px;
  }
</style>
