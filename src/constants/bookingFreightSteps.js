export const BOOKING_FREIGHT_STEPS = [
  { value: 'draft', title: 'Draft', icon: 'mdi-file-document-edit-outline' },
  { value: 'saved', title: 'Saved', icon: 'mdi-content-save-outline' },
  { value: 'submitted', title: 'Submitted', icon: 'mdi-send-outline' },
  { value: 'request_approve', title: 'Request for Approve', icon: 'mdi-account-check-outline' },
  { value: 'approved', title: 'Approved', icon: 'mdi-check-circle-outline' },
  { value: 'booking_released', title: 'Booking Released', icon: 'mdi-ferry' },
  { value: 'si_submitted', title: 'SI Submitted', icon: 'mdi-file-document-outline' },
  { value: 'booking_completed', title: 'Booking Completed', icon: 'mdi-checkbox-marked-circle-outline' },
]

export function getFreightStepIndex(status) {
  const raw = String(status ?? '').trim()
  const idx = BOOKING_FREIGHT_STEPS.findIndex(s => s.title === raw)
  return Math.max(idx, 0)
}
