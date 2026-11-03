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
  return []
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

const STATUS_BADGE_TONE = {
  draft: 'default',
  saved: 'pending',
  submit: 'pending',
  new: 'pending',
  processing: 'si',
  'in progress': 'si',
  'pending approve': 'pending',
  'pending approval': 'pending',
  'request for approve': 'pending',
  'waiting for approve': 'pending',
  submitted: 'approved',
  submited: 'approved',
  accept: 'approved',
  accepted: 'approved',
  approved: 'approved',
  confirmed: 'approved',
  active: 'approved',
  yes: 'approved',
  release: 'approved',
  'booking released': 'approved',
  'si submitted': 'si',
  'pending for submit si': 'si',
  'booking completed': 'shipped',
  shipped: 'shipped',
  completed: 'shipped',
  cancel: 'default',
  cancelled: 'default',
  canceled: 'default',
  deactive: 'default',
  inactive: 'default',
  no: 'default',
}

export function getBookingStatusBadgeTone(status) {
  if (status === 1 || status === true) {
    return 'approved'
  }
  if (status === 0 || status === false) {
    return 'default'
  }
  const raw = String(status ?? '')
    .trim()
    .toLowerCase()
  if (!raw) {
    return 'default'
  }
  if (STATUS_BADGE_TONE[raw]) {
    return STATUS_BADGE_TONE[raw]
  }
  if (raw.includes('si submit')) {
    return 'si'
  }
  if (raw.includes('pending')) {
    return 'pending'
  }
  if (raw.includes('ship') || raw.includes('complete')) {
    return 'shipped'
  }
  if (raw.includes('approv') || raw.includes('accept') || raw.includes('release')) {
    return 'approved'
  }
  return 'default'
}
