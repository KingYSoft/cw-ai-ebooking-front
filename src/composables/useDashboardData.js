import { computed, ref } from 'vue'
import { dashboardBookingAnalysis } from '@/api/dashboard'
import { mapBookingListRow } from '@/composables/mapEbookingBooking'

const CARD_KEYS = ['pendingSubmit', 'waitingApproval', 'pendingSi', 'rejected']

const SEGMENT_COLORS = ['#0f766e', '#f59e0b', '#6366f1', '#0e7490', '#ef5b5b', '#2ec4a7', '#64748b']

const EMPTY_ANALYSIS = {
  total_count: 0,
  draft_count: 0,
  submit_count: 0,
  release_count: 0,
  si_submit_count: 0,
  cancelled_count: 0,
  daily_count: 0,
  weekly_count: 0,
  monthly_count: 0,
  booking_analysis: [],
  latest_bookings: [],
}

function asCount(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function itemTimestamp(item) {
  const time = Date.parse(item?.creationTime)
  return Number.isNaN(time) ? 0 : time
}

function formatContainerSummary(value) {
  let rows = []
  if (Array.isArray(value)) {
    rows = value
  } else if (typeof value === 'string' && value.startsWith('[')) {
    try {
      rows = JSON.parse(value)
    } catch {
      rows = []
    }
  }
  const parts = (rows || [])
    .map(row => {
      const type = row?.pac_container_type
      const count = row?.pac_container_count
      if (!type) {
        return ''
      }
      return count == null || count === '' ? type : `${type} x ${count}`
    })
    .filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : '—'
}

function formatBookingNo(item) {
  const no = item.bkg_consign_no
  if (!no) {
    return '—'
  }
  return String(no).startsWith('BKG-') ? String(no) : `BKG-${no}`
}

function mapLatestBooking(item, index) {
  const row = mapBookingListRow(item, index)
  return {
    ...row,
    consignee_name: row.consignee_name || '',
    container_summary: formatContainerSummary(item.container_summary),
  }
}

export function useDashboardData() {
  const loading = ref(true)
  const analysisData = ref({ ...EMPTY_ANALYSIS })

  const cardCounts = computed(() => ({
    pendingSubmit: asCount(analysisData.value.draft_count),
    waitingApproval: asCount(analysisData.value.submit_count),
    pendingSi: asCount(analysisData.value.release_count),
    rejected: asCount(analysisData.value.cancelled_count),
  }))

  const latestTransactions = computed(() =>
    (analysisData.value.latest_bookings || []).map((item, index) =>
      mapLatestBooking(item, index + 1),
    ),
  )

  const periodCounts = computed(() => ({
    daily: asCount(analysisData.value.daily_count),
    weekly: asCount(analysisData.value.weekly_count),
    monthly: asCount(analysisData.value.monthly_count),
  }))

  const analysis = computed(() => {
    const segments = (analysisData.value.booking_analysis || [])
      .map((item, index) => ({
        key: item.consignee_name || String(index),
        label: item.consignee_name || '—',
        value: asCount(item.count),
        color: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)

    return {
      total: asCount(analysisData.value.total_count),
      segments,
    }
  })

  const loadData = async (period = 'lastMonth') => {
    loading.value = true
    try {
      const { success, data } = await dashboardBookingAnalysis({ period })
      analysisData.value = success && data ? { ...EMPTY_ANALYSIS, ...data } : { ...EMPTY_ANALYSIS }
    } catch (error) {
      console.log(error)
      analysisData.value = { ...EMPTY_ANALYSIS }
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    cardCounts,
    latestTransactions,
    periodCounts,
    analysis,
    loadData,
    formatBookingNo,
    itemTimestamp,
    CARD_KEYS,
  }
}
