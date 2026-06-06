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
