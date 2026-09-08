import { computed, ref } from 'vue'
import { bookingQueryPage } from '@/api/booking'
import { mapBookingListRow } from '@/composables/mapEbookingBooking'
import { MOCK_DASHBOARD_BOOKINGS } from '@/mock/dashboard'

const CARD_KEYS = ['pendingSubmit', 'waitingApproval', 'pendingSi', 'rejected']

const STATUS_TO_CARD = {
  draft: 'pendingSubmit',
  saved: 'pendingSubmit',
  submitted: 'waitingApproval',
  request_approve: 'waitingApproval',
  under_review: 'waitingApproval',
  approved: 'pendingSi',
  booking_released: 'pendingSi',
  rejected: 'rejected',
}

const SEGMENT_COLORS = ['#2a5bd6', '#f5c542', '#8b5cf6', '#ef5b5b', '#f59e0b', '#2ec4a7', '#64748b']

function bookingStatus(item) {
  return String(
    item.freight_status || item.booking_status || item.bkg_shipment_status || item.bkg_status || '',
  ).toLowerCase()
}

function cardKeyFor(item) {
  const status = bookingStatus(item)
  if (status === 'rejected' || String(item.booking_status || '').toLowerCase() === 'rejected') {
    return 'rejected'
  }
  return STATUS_TO_CARD[status] ?? null
}

function itemTimestamp(item) {
  const raw =
    item.last_modify_time ||
    item.last_modified_time ||
    item.modify_time ||
    item.creation_time ||
    item.create_time ||
    item.create_gmt ||
    item.bkg_etd
  const time = Date.parse(raw)
  return Number.isNaN(time) ? 0 : time
}

function startOfDay(date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function inRange(timestamp, from, to) {
  return timestamp >= from.getTime() && timestamp <= to.getTime()
}

function formatBookingNo(item) {
  const no = item.bkg_consign_no || item.bkg_booking_reference || ''
  if (!no) {
    return '—'
  }
  return String(no).startsWith('BKG-') ? String(no) : `BKG-${no}`
}

export function useDashboardData() {
  const loading = ref(true)
  const items = ref([])

  const cardCounts = computed(() => {
    const counts = {
      pendingSubmit: 0,
      waitingApproval: 0,
      pendingSi: 0,
      rejected: 0,
    }
    items.value.forEach(item => {
      const key = cardKeyFor(item)
      if (key && Object.prototype.hasOwnProperty.call(counts, key)) {
        counts[key] += 1
      }
    })
    return counts
  })

  const latestTransactions = computed(() =>
    [...MOCK_DASHBOARD_BOOKINGS].sort((a, b) => itemTimestamp(b) - itemTimestamp(a)).slice(0, 10),
  )

  const periodCounts = computed(() => {
    const now = new Date()
    const todayStart = startOfDay(now)
    const weekStart = startOfDay(addDays(now, -6))
    const monthStart = startOfDay(addDays(now, -29))
    const todayEnd = now

    let daily = 0
    let weekly = 0
    let monthly = 0
    MOCK_DASHBOARD_BOOKINGS.forEach(item => {
      const time = itemTimestamp(item)
      if (!time) {
        return
      }
      if (inRange(time, todayStart, todayEnd)) {
        daily += 1
      }
      if (inRange(time, weekStart, todayEnd)) {
        weekly += 1
      }
      if (inRange(time, monthStart, todayEnd)) {
        monthly += 1
      }
    })
    return { daily, weekly, monthly }
  })

  const analysisByPeriod = period => {
    const now = new Date()
    let from = null
    if (period === 'lastMonth') {
      from = startOfDay(addDays(now, -29))
    } else if (period === 'last3Months') {
      from = startOfDay(addDays(now, -89))
    } else if (period === 'thisYear') {
      from = new Date(now.getFullYear(), 0, 1)
    }

    const filtered = MOCK_DASHBOARD_BOOKINGS.filter(item => {
      if (!from) {
        return true
      }
      const time = itemTimestamp(item)
      return time >= from.getTime()
    })

    const tally = new Map()
    filtered.forEach(item => {
      const name = item.consignee_name || item.consignee?.add_address_name || '—'
      tally.set(name, (tally.get(name) || 0) + 1)
    })

    const segments = [...tally.entries()]
      .map(([name, value], index) => ({
        key: name,
        label: name,
        value,
        color: SEGMENT_COLORS[index % SEGMENT_COLORS.length],
      }))
      .sort((a, b) => b.value - a.value)

    return {
      total: filtered.length,
      segments,
    }
  }

  const loadData = async () => {
    loading.value = true
    try {
      const { success, data } = await bookingQueryPage({
        filters: [
          {
            key: 'bkg_etd',
            op: 'between',
            val: '',
            start: '2000-01-01',
            end: '2099-12-31',
          },
        ],
        skipCount: 0,
        maxResultCount: 2000,
      })
      const list = success && data ? (data.items ?? []) : []
      items.value = list.map((item, index) => mapBookingListRow(item, index + 1))
    } catch (error) {
      console.log(error)
      items.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    items,
    cardCounts,
    latestTransactions,
    periodCounts,
    analysisByPeriod,
    loadData,
    formatBookingNo,
    itemTimestamp,
    bookingStatus,
    cardKeyFor,
    CARD_KEYS,
  }
}
