<template>
  <FPageLayout :card-loading="cardLoading" :skeleton-loading="skeletonLoading">
    <LayoutWithToolbar :divider="false" :spacer="true" :title="pageTitle">
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
  import { computed, onMounted, ref } from 'vue'

  import FPageLayout from '@/components/FPageLayout.vue'
  import BookingFreightStepper from '@/components/freight/BookingFreightStepper.vue'
  import EbookingBookingFormContent from '@/components/freight/EbookingBookingFormContent.vue'
  import LayoutWithToolbar from '@/components/LayoutWithToolbar.vue'
  import { useEbookingBookingForm } from '@/composables/useEbookingBookingForm'

  const props = defineProps({
    isEditMode: { type: Boolean, default: false },
    title: { type: String, default: 'New Booking' },
  })

  const {
    skeletonLoading,
    cardLoading,
    activedTab,
    inputData,
    loadData,
    onSave,
    addNewContainer,
    removeNewContainer,
    tabTitle,
  } = useEbookingBookingForm({ isEditMode: props.isEditMode })

  const refForm = ref(null)

  const registerFormRef = el => {
    refForm.value = el
  }

  const pageTitle = computed(() => (props.isEditMode ? tabTitle() : props.title))

  const handleSave = async () => {
    const result = await refForm.value?.validate?.()
    if (result?.valid === false) return
    await onSave()
  }

  onMounted(() => loadData())
</script>
