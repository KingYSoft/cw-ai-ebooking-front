<template>
  <v-stepper
    alt-labels
    class="booking-freight-stepper"
    color="primary"
    flat
    hide-actions
    item-props
    :items="stepperItems"
    :model-value="currentStepValue"
    non-linear
  >
    <template v-for="item in stepperItems" :key="item.value" #[`item.${item.value}`]>
      <div class="d-none" />
    </template>
  </v-stepper>
</template>

<script setup>
  import { computed } from 'vue'

  import { useBookingPageI18n } from '@/composables/useBookingPageI18n'
  import { BOOKING_FREIGHT_STEPS, getFreightStepIndex } from '@/constants/bookingFreightSteps'

  const { freightStep } = useBookingPageI18n()

  const status = defineModel('status', { type: String, default: 'draft' })

  const currentIndex = computed(() => getFreightStepIndex(status.value))
  const currentStepValue = computed(() => currentIndex.value + 1)

  const stepperItems = computed(() =>
    BOOKING_FREIGHT_STEPS.map((step, index) => ({
      title: freightStep(step.value),
      value: index + 1,
      icon: step.icon,
      color: 'primary',
      complete: index < currentIndex.value,
      completeIcon: step.icon,
      editable: false,
    })),
  )
</script>

<style scoped>
  .booking-freight-stepper {
    background: transparent;
  }

  .booking-freight-stepper:deep(.v-sheet) {
    box-shadow: none;
  }

  .booking-freight-stepper:deep(.v-stepper-header) {
    box-shadow: none;
    background: transparent;
  }

  .booking-freight-stepper:deep(.v-stepper-window) {
    display: none;
    margin: 0;
  }

  .booking-freight-stepper:deep(.v-stepper-item) {
    color: rgb(var(--v-theme-primary));
    opacity: 0.5;
  }

  .booking-freight-stepper:deep(.v-stepper-item--selected),
  .booking-freight-stepper:deep(.v-stepper-item--complete) {
    opacity: 1;
  }

  .booking-freight-stepper:deep(.v-stepper-item__avatar.v-avatar) {
    background: rgba(var(--v-theme-primary), 0.35);
    color: rgb(var(--v-theme-on-primary));
  }

  .booking-freight-stepper:deep(.v-stepper-item--selected .v-stepper-item__avatar.v-avatar),
  .booking-freight-stepper:deep(.v-stepper-item--complete .v-stepper-item__avatar.v-avatar) {
    background: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-on-primary));
  }

  .booking-freight-stepper:deep(.v-stepper-item__title) {
    color: rgb(var(--v-theme-primary));
    font-size: 0.75rem;
    line-height: 1.25rem;
    letter-spacing: 0.0333333333em;
  }

  .booking-freight-stepper:deep(.v-stepper-header .v-divider) {
    border-color: rgba(var(--v-theme-primary), 0.45);
    opacity: 1;
  }
</style>
