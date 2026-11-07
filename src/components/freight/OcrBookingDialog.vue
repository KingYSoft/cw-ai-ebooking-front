<template>
  <v-dialog max-width="800" :model-value="open" persistent @update:model-value="onClose">
    <v-card
      :disabled="loading"
      :loading="loading"
      :title="t('$vuetify.custom.upload.ocr.title')"
    >
      <template #loader="{ isActive }">
        <v-progress-linear :active="isActive" color="deep-purple" height="4" indeterminate />
      </template>

      <template #append>
        <v-btn
          density="comfortable"
          icon="mdi-close"
          size="small"
          variant="text"
          @click="onClose"
        />
      </template>

      <v-card-text>
        <FUploadZone
          ref="refOcrUpload"
          accept=".pdf,.xls,.xlsx,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :max-files="1"
          :upload-button-text="ocr('recognition')"
          @clear="clearPrefill"
          @upload="handleOcrUpload"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { bookingOcrNewBooking } from '@/api/booking'
  import FUploadZone from '@/components/FUploadZone.vue'
  import { useBookingPageI18n } from '@/composables/useBookingPageI18n'
  import { useAppStore } from '@/stores/app'

  defineOptions({ name: 'OcrBookingDialog' })

  const OCR_BOOKING_STORAGE_KEY = 'booking_ocr_prefill'
  const open = defineModel({ type: Boolean, default: false })
  const { t, ocr } = useBookingPageI18n()
  const router = useRouter()
  const appStore = useAppStore()
  const loading = ref(false)
  const refOcrUpload = ref(null)

  const clearPrefill = () => {
    sessionStorage.removeItem(OCR_BOOKING_STORAGE_KEY)
  }

  const onClose = () => {
    if (loading.value) {
      return
    }
    clearPrefill()
    refOcrUpload.value?.clearFiles?.()
    open.value = false
  }

  const handleOcrUpload = async data => {
    if (!data?.files?.length || !data.files[0]?.file) {
      appStore.openMessage({
        content: ocr('uploadPdfFirst'),
        color: 'warning',
      })
      return
    }
    loading.value = true
    try {
      appStore.openGlobalLoading(ocr('inProgress'))
      const formData = new FormData()
      formData.append('file', data.files[0].file)
      const resp = await bookingOcrNewBooking(formData)
      if (resp && resp.success) {
        const ocrResult = resp.data
        if (!ocrResult || typeof ocrResult !== 'object') {
          throw new Error(ocr('missingData'))
        }
        appStore.closeGlobalLoading()
        appStore.openMessage({
          content: ocr('success'),
          color: 'success',
        })
        refOcrUpload.value?.clearFiles?.()
        sessionStorage.setItem(OCR_BOOKING_STORAGE_KEY, JSON.stringify(ocrResult))
        open.value = false
        router.push({
          name: 'booking_new',
          query: { source: 'ocr' },
        })
      }
    } catch (error) {
      console.log(error)
      appStore.openMessage({
        content: error?.message || ocr('failed'),
        color: 'error',
      })
    } finally {
      appStore.closeGlobalLoading()
      loading.value = false
    }
  }
</script>
