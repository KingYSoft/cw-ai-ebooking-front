export const BOOKING_FREIGHT_STEPS = [
  { value: 'draft', title: 'Draft', icon: 'mdi-file-document-edit-outline' },
  { value: 'saved', title: 'Saved', icon: 'mdi-content-save-outline' },
  { value: 'submitted', title: 'Submitted', icon: 'mdi-send-outline' },
  { value: 'processing', title: 'Processing', icon: 'mdi-progress-clock' },
  { value: 'booking_released', title: 'Booking Released', icon: 'mdi-ferry' },
  { value: 'si_submitted', title: 'SI Submitted', icon: 'mdi-file-document-outline' },
  { value: 'booking_completed', title: 'Booking Completed', icon: 'mdi-checkbox-marked-circle-outline' },
]

const BOOKING_RELEASED_STEP_INDEX = BOOKING_FREIGHT_STEPS.findIndex(s => s.value === 'booking_released')
const SI_SUBMITTED_STEP_INDEX = BOOKING_FREIGHT_STEPS.findIndex(s => s.value === 'si_submitted')
const PROCESSING_STEP_INDEX = BOOKING_FREIGHT_STEPS.findIndex(s => s.value === 'processing')

export function getFreightStepIndex(status) {
  const raw = String(status ?? '').trim()
  const idx = BOOKING_FREIGHT_STEPS.findIndex(s => s.title === raw)
  return Math.max(idx, 0)
}

export function isProcessingOrLater(status) {
  const raw = String(status ?? '').trim()
  const idx = BOOKING_FREIGHT_STEPS.findIndex(s => s.title === raw)
  return idx >= PROCESSING_STEP_INDEX
}

export function isBookingReleasedOrLater(status) {
  const raw = String(status ?? '').trim()
  const idx = BOOKING_FREIGHT_STEPS.findIndex(s => s.title === raw)
  return idx >= BOOKING_RELEASED_STEP_INDEX
}

export function isSiSubmittedOrLater(status) {
  const raw = String(status ?? '').trim()
  const idx = BOOKING_FREIGHT_STEPS.findIndex(s => s.title === raw)
  return idx >= SI_SUBMITTED_STEP_INDEX
}
