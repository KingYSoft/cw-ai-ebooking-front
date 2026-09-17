export const BOOKING_LIST_STATUS_OPTIONS = [
  { value: 'Saved', title: 'Saved', labelKey: 'saved' },
  { value: 'Request for Approve', title: 'Waiting for Approve', labelKey: 'waiting_approve' },
  { value: 'Booking Released', title: 'Pending for Submit SI', labelKey: 'pending_si' },
  { value: 'Cancel', title: 'Deactive', labelKey: 'deactive' },
]

export const BOOKING_LIST_STATUS_VALUES = BOOKING_LIST_STATUS_OPTIONS.map(item => item.value)

export const DASHBOARD_CARD_STATUS_MAP = {
  pendingSubmit: 'Saved',
  waitingApproval: 'Request for Approve',
  pendingSi: 'Booking Released',
  rejected: 'Cancel',
}

export function defaultBookingListStatusSelection() {
  return [...BOOKING_LIST_STATUS_VALUES]
}

export function statusesFromQuery(statusQuery) {
  const raw = Array.isArray(statusQuery) ? statusQuery[0] : statusQuery
  if (typeof raw === 'string' && BOOKING_LIST_STATUS_VALUES.includes(raw)) {
    return [raw]
  }
  return defaultBookingListStatusSelection()
}

const STATUS_LABEL_MAP = Object.fromEntries(
  BOOKING_LIST_STATUS_OPTIONS.map(item => [item.value, item.title]),
)

export function getBookingListStatusLabel(status) {
  if (!status) {
    return ''
  }
  return STATUS_LABEL_MAP[status] ?? status
}

export const BOOKING_LIST_STATUS_CHIP = {
  Saved: { color: 'primary', variant: 'tonal' },
  'Request for Approve': { color: 'warning', variant: 'tonal' },
  'Booking Released': { color: 'success', variant: 'tonal' },
  Cancel: { color: 'grey', variant: 'tonal' },
}

export function getBookingListStatusChipProps(status) {
  return BOOKING_LIST_STATUS_CHIP[status] ?? { color: 'default', variant: 'tonal' }
}
