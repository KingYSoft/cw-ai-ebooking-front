<template>
  <span v-if="label" class="status-badge" :class="`status-badge--${tone}`">
    {{ label }}
  </span>
</template>

<script setup>
  import { computed } from 'vue'
  import { getBookingStatusBadgeTone } from '@/constants/bookingListStatus'

  defineOptions({ name: 'StatusBadge' })

  const props = defineProps({
    text: {
      type: [String, Number, Boolean],
      default: '',
    },
    toneKey: {
      type: [String, Number, Boolean],
      default: undefined,
    },
  })

  const label = computed(() => {
    if (props.text == null || props.text === '') {
      return ''
    }
    return String(props.text)
  })

  const tone = computed(() => getBookingStatusBadgeTone(props.toneKey ?? props.text))
</script>
