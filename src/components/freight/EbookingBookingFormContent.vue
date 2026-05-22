<template>
  <v-sheet color="transparent">
    <div v-show="activedTab === 1">
      <EbookingBookingGeneralInfo
        v-model:input-data="inputData"
        @add-container="emit('add-container')"
        @register-form-ref="emit('register-form-ref', $event)"
        @remove-container="emit('remove-container', $event)"
      />
    </div>

    <div v-show="activedTab === 2">
      <v-card-text class="text-medium-emphasis">Additional Details (coming soon)</v-card-text>
    </div>

    <div v-show="activedTab === 3">
      <v-card-text class="text-medium-emphasis">eDocs (coming soon)</v-card-text>
    </div>

    <div v-show="activedTab === 4">
      <v-card-text class="text-medium-emphasis">Log (coming soon)</v-card-text>
    </div>
  </v-sheet>
</template>

<script setup>
  defineProps({
    activedTab: { type: Number, default: 1 },
  })

  const emit = defineEmits(['add-container', 'remove-container', 'register-form-ref'])

  const inputData = defineModel('input-data', { type: Object, required: true })
</script>
