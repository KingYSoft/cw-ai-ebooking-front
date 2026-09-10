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

const ACTIVE_STATUS_TO_STEP = {
  Draft: 'saved',
  Submit: 'request_approve',
  Accept: 'approved',
  Release: 'booking_released',
  SI_Submit: 'si_submitted',
}

export function getFreightStepIndex(status) {
  const raw = String(status ?? '').trim()
  const stepValue = raw ? ACTIVE_STATUS_TO_STEP[raw] : 'draft'
  const idx = BOOKING_FREIGHT_STEPS.findIndex(s => s.value === stepValue)
  return Math.max(idx, 0)
}
