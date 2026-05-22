<template>
  <v-dialog v-model="appStore.unsavedInputDataDialogOpen" max-width="420" persistent>
    <v-card
      prepend-icon="mdi-alert-circle-outline"
      :title="t('$vuetify.custom.unsavedInputData.title')"
    >
      <v-card-text class="pb-2">
        {{ t('$vuetify.custom.unsavedInputData.message') }}
      </v-card-text>

      <template #actions>
        <v-spacer />

        <v-btn variant="text" @click="appStore.closeUnsavedInputDataDialog">
          {{ t('$vuetify.custom.dialog.btn.cancel') }}
        </v-btn>

        <v-btn color="primary" variant="flat" @click="appStore.confirmUnsavedInputDataDialog">
          {{ t('$vuetify.custom.dialog.btn.ok') }}
        </v-btn>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { useLocale } from 'vuetify'
  import { useAppStore } from '@/stores/app'

  const { t } = useLocale()
  const appStore = useAppStore()
</script>
