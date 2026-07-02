<template>
  <PagesFreightBookingFormPage is-edit-mode />
</template>

<script setup>
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
      tabTitle: 'BKG-{shipment_no}',
    },
  })
</script>
