<template>
  <FPageLayout :card-loading="cardLoading" :skeleton-loading="skeletonLoading">
    <LayoutWithToolbar :divider="false" :spacer="true" :title="isEditMode ? undefined : props.title">
      <template v-if="isEditMode" #title>
        <div class="d-flex align-center ga-2">
          <div class="d-flex flex-column ga-0">
            <span class="font-weight-bold text-body-2">Booking</span>

            <div class="d-flex align-center ga-1">
              <span class="font-weight-bold text-body-2">{{ displayBookingNo() }}</span>
              <v-icon
                v-if="inputData.bkg_consign_no && !isCopyAsNew()"
                icon="mdi-content-copy"
                size="14"
                @click="handleCopyBookingNo"
              />
            </div>
          </div>
        </div>
      </template>

      <template #actions>
        <v-btn
          color="primary"
          :disabled="cardLoading"
          size="small"
          variant="flat"
          @click="handleSave"
        >
          Save
        </v-btn>
      </template>
    </LayoutWithToolbar>

    <BookingFreightStepper v-model:status="inputData.freight_status" />
    <v-divider />

    <v-tabs v-model="activedTab" color="deep-purple-accent-4" density="comfortable">
      <v-tab :value="1">Booking</v-tab>
      <v-tab :value="2">Additional Details</v-tab>
      <v-tab :value="3">eDocs</v-tab>
      <v-tab :value="4">Log</v-tab>
    </v-tabs>

    <v-divider />

    <v-sheet class="overflow-y-auto" style="flex: 1">
      <EbookingBookingFormContent
        v-model:input-data="inputData"
        :actived-tab="activedTab"
        @add-container="addNewContainer"
        @register-form-ref="registerFormRef"
        @remove-container="removeNewContainer"
      />
    </v-sheet>
  </FPageLayout>
</template>

<script setup>
  import { onMounted, ref } from 'vue'

  import FPageLayout from '@/components/FPageLayout.vue'
  import BookingFreightStepper from '@/components/freight/BookingFreightStepper.vue'
  import EbookingBookingFormContent from '@/components/freight/EbookingBookingFormContent.vue'
  import LayoutWithToolbar from '@/components/LayoutWithToolbar.vue'
  import { useEbookingBookingForm } from '@/composables/useEbookingBookingForm'
  import { useAppStore } from '@/stores/app'

  const props = defineProps({
    isEditMode: { type: Boolean, default: false },
    title: { type: String, default: 'New Booking' },
  })

  const appStore = useAppStore()

  const {
    skeletonLoading,
    cardLoading,
    activedTab,
    inputData,
    loadData,
    onSave,
    addNewContainer,
    removeNewContainer,
    displayBookingNo,
    isCopyAsNew,
  } = useEbookingBookingForm({ isEditMode: props.isEditMode })

  const refForm = ref(null)

  const registerFormRef = el => {
    refForm.value = el
  }

  const handleCopyBookingNo = () => {
    const bookingNo = inputData.value.bkg_consign_no || ''
    if (!bookingNo) {
      return
    }
    navigator.clipboard.writeText(bookingNo)
    appStore.openMessage({
      content: 'Booking No. copied to clipboard.',
      color: 'success',
    })
  }

  const handleSave = async () => {
    const result = await refForm.value?.validate?.()
    if (result?.valid === false) return
    await onSave()
  }

  onMounted(async () => {
    await loadData()
  })
</script>
