<template>
  <BookingFormPage is-edit-mode />
</template>

<script setup>
  import BookingFormPage from '@/components/freight/BookingFormPage.vue'

  defineOptions({ name: 'BookingEdit' })
  definePage({
    name: 'booking_edit-pk',
    icon: 'mdi-clipboard-text-outline',
    menu: false,
    order: 3,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      tabTitle: 'Booking',
    },
  })
</script>
