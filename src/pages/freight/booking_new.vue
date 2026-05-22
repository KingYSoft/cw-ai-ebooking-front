<template>
  <BookingFormPage title="New Booking" />
</template>

<script setup>
  import BookingFormPage from '@/components/freight/BookingFormPage.vue'

  defineOptions({ name: 'BookingNew' })
  definePage({
    name: 'booking_new',
    icon: 'mdi-clipboard-text-outline',
    menu: false,
    order: 2,
    meta: {
      keepAlive: false,
      requiresAuth: true,
      isLayout: true,
      tabTitle: 'New Booking',
    },
  })
</script>
