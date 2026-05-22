<template>
  <v-snackbar
    v-model="appStore.messageOpen"
    :color="appStore.messageOptions.color ? appStore.messageOptions.color : 'info'"
    location="top"
    :min-width="290"
    :text="appStore.messageOptions.content"
    :timeout="appStore.messageOptions.timeout ?? 3000"
    variant="elevated"
  >
    <template #actions>
      <v-btn icon="mdi-close" size="small" variant="text" @click="appStore.messageOpen = false" />
    </template>
  </v-snackbar>
</template>

<script setup>
  import { useAppStore } from '@/stores/app'
  const appStore = useAppStore()
  defineOptions({
    name: 'MessageSnack',
  })
</script>
