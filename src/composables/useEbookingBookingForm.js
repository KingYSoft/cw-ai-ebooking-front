import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { bookingDetail, bookingSave } from '@/api/booking'
import {
  createDefaultBookingForm,
  mapBookingDetailToForm,
  mapFormToSavePayload,
} from '@/composables/mapEbookingBooking'
import { useAppStore } from '@/stores/app'

export function useEbookingBookingForm(options = {}) {
  const { isEditMode = false } = options
  const router = useRouter()
  const route = useRoute()
  const appStore = useAppStore()

  const skeletonLoading = ref(isEditMode)
  const cardLoading = ref(false)
  const activedTab = ref(1)

  const defaultData = () => createDefaultBookingForm(appStore)

  const inputData = ref(defaultData())

  const loadData = async () => {
    if (!isEditMode) {
      skeletonLoading.value = false
      inputData.value = defaultData()
      return
    }

    skeletonLoading.value = true
    try {
      const { success, data } = await bookingDetail(route.params.pk)
      if (!success || !data) {
        appStore.openMessage({ content: 'Booking not found.', color: 'warning' })
        router.push({ name: 'booking' })
        return
      }
      inputData.value = mapBookingDetailToForm(data, appStore)
    } catch (error) {
      console.log(error)
      appStore.openMessage({ content: 'Failed to load booking.', color: 'error' })
      router.push({ name: 'booking' })
    } finally {
      skeletonLoading.value = false
    }
  }

  const onSave = async () => {
    cardLoading.value = true
    try {
      const isCopyAsNew = String(route.query.copy ?? '') === '1'
      const payload = mapFormToSavePayload(inputData.value, { isCopyAsNew })
      const { success, data } = await bookingSave(payload)

      if (!success || !data) {
        return
      }

      inputData.value.id = data.id ?? inputData.value.id
      inputData.value.pk = data.pk ?? inputData.value.pk
      if (data.bkg_consign_no) {
        inputData.value.bkg_consign_no = data.bkg_consign_no
      }

      if (inputData.value.freight_status === 'draft') {
        inputData.value.freight_status = 'saved'
      }

      appStore.openMessage({ content: 'Booking saved.', color: 'success' })

      if (!isEditMode || isCopyAsNew) {
        router.push({
          name: 'booking_edit-pk',
          params: { pk: data.pk },
          query: {
            id: data.id,
            shipment_no: data.bkg_consign_no ?? inputData.value.bkg_consign_no,
          },
        })
      }
    } catch (error) {
      console.log(error)
    } finally {
      cardLoading.value = false
    }
  }

  const addNewContainer = () => {
    inputData.value.pac_list.push({
      id: Date.now(),
      pac_container_type: '20GP',
      pac_container_count: 1,
      pac_container_num: '',
      pac_seal_num: '',
      pac_is_soc: false,
      pac_commodity: '',
      pac_gross_weight: null,
      pac_actual_volume: null,
      pac_package_count: null,
      pac_harmonised_code: '',
      pac_goods_description: '',
    })
  }

  const removeNewContainer = index => {
    inputData.value.pac_list.splice(index, 1)
  }

  const tabTitle = () => {
    if (isEditMode && inputData.value.bkg_consign_no) {
      return inputData.value.bkg_consign_no
    }
    return 'New Booking'
  }

  return {
    skeletonLoading,
    cardLoading,
    activedTab,
    inputData,
    loadData,
    onSave,
    addNewContainer,
    removeNewContainer,
    tabTitle,
  }
}
