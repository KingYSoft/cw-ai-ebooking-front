export const BOOKING_LIST_STATUS_OPTIONS = [
  { value: 'submitted', title: 'Submitted' },
  { value: 'under_review', title: 'Under review' },
  { value: 'confirmed', title: 'Confirmed' },
  { value: 'cancelled', title: 'Cancelled' },
  { value: 'rejected', title: 'Rejected' },
]

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
  submitted: { color: 'primary', variant: 'tonal' },
  under_review: { color: 'warning', variant: 'tonal' },
  confirmed: { color: 'success', variant: 'tonal' },
  cancelled: { color: 'grey', variant: 'tonal' },
  rejected: { color: 'error', variant: 'tonal' },
}

export function getBookingListStatusChipProps(status) {
  return BOOKING_LIST_STATUS_CHIP[status] ?? { color: 'default', variant: 'tonal' }
}
