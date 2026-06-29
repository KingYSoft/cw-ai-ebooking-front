import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { bookingDetail, bookingSave } from '@/api/booking'
import {
  createDefaultBookingForm,
  mapBookingDetailToForm,
  mapFormToSavePayload,
} from '@/composables/mapEbookingBooking'
import { useAppStore } from '@/stores/app'

const TAB_PREFIX = 'BK-'

export function resolveBookingConsignNo(data, form) {
  return data?.bkg_consign_no ?? form?.bkg_consign_no ?? data?.shipment_no ?? ''
}

function buildEditTabQuery(consignNo, id, options = {}) {
  const query = {
    id: id ?? '',
    shipment_no: consignNo,
  }
  if (options.isCopyAsNew) {
    query.copy = '1'
  }
  return query
}

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

  const isCopyAsNew = () => String(route.query.copy ?? '') === '1'

  const syncBookingEditTab = ({
    oldTabValue,
    pk,
    id,
    consignNo,
    copyAsNew = isCopyAsNew(),
  } = {}) => {
    const tabPk = pk ?? route.params.pk
    if (!tabPk) {
      return
    }

    const newTabValue = `booking_edit-pk-${tabPk}`
    const title = copyAsNew ? 'New Booking' : `${TAB_PREFIX}${consignNo}`
    const query = buildEditTabQuery(consignNo, id, { isCopyAsNew: copyAsNew })

    appStore.event.trigger('replaceBookingEditTab', {
      oldTabValue: oldTabValue ?? newTabValue,
      newTabValue,
      title,
      to: {
        name: 'booking_edit-pk',
        params: { pk: tabPk },
        query,
      },
      params: { pk: tabPk },
      query,
    })
  }

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

      const consignNo = resolveBookingConsignNo(data, inputData.value)
      if (!isCopyAsNew() && consignNo) {
        syncBookingEditTab({
          pk: route.params.pk,
          id: data.id,
          consignNo,
        })

        if (!route.query.shipment_no) {
          await router.replace({
            query: {
              ...route.query,
              id: String(data.id ?? route.query.id ?? ''),
              shipment_no: consignNo,
            },
          })
        }
      }
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
      const copyAsNew = isCopyAsNew()
      const payload = mapFormToSavePayload(inputData.value, { isCopyAsNew: copyAsNew })
      const { success, data } = await bookingSave(payload)

      if (!success || !data) {
        return
      }

      const consignNo = resolveBookingConsignNo(data, inputData.value)

      inputData.value.id = data.id ?? inputData.value.id
      inputData.value.pk = data.pk ?? inputData.value.pk
      if (consignNo) {
        inputData.value.bkg_consign_no = consignNo
      }

      if (inputData.value.freight_status === 'draft') {
        inputData.value.freight_status = 'saved'
      }

      appStore.openMessage({ content: 'Booking saved.', color: 'success' })

      const editQuery = buildEditTabQuery(consignNo, data.id)

      if (!isEditMode) {
        await router.replace({
          name: 'booking_edit-pk',
          params: { pk: data.pk },
          query: editQuery,
        })
        appStore.event.trigger('replaceBookingEditTab', {
          oldTabValue: 'booking_new',
          newTabValue: `booking_edit-pk-${data.pk}`,
          title: `${TAB_PREFIX}${consignNo}`,
          to: {
            name: 'booking_edit-pk',
            params: { pk: data.pk },
            query: editQuery,
          },
          params: { pk: data.pk },
          query: editQuery,
        })
        return
      }

      if (copyAsNew) {
        const oldPk = route.params.pk?.toString()
        await router.replace({
          name: 'booking_edit-pk',
          params: { pk: data.pk },
          query: editQuery,
        })
        appStore.event.trigger('replaceBookingEditTab', {
          oldTabValue: `booking_edit-pk-${oldPk}`,
          newTabValue: `booking_edit-pk-${data.pk}`,
          title: `${TAB_PREFIX}${consignNo}`,
          to: {
            name: 'booking_edit-pk',
            params: { pk: data.pk },
            query: editQuery,
          },
          params: { pk: data.pk },
          query: editQuery,
        })
        return
      }

      syncBookingEditTab({
        pk: data.pk,
        id: data.id,
        consignNo,
      })

      if (consignNo && route.query.shipment_no !== consignNo) {
        await router.replace({
          query: {
            ...route.query,
            id: String(data.id ?? route.query.id ?? ''),
            shipment_no: consignNo,
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
    if (!isEditMode || isCopyAsNew()) {
      return 'New Booking'
    }
    const shipmentNo =
      route.query.shipment_no || inputData.value.bkg_consign_no || inputData.value.shipment_no || ''
    return `${TAB_PREFIX}${shipmentNo}`
  }

  const displayBookingNo = () => tabTitle().replace(`${TAB_PREFIX}`, '')

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
    displayBookingNo,
    isCopyAsNew,
  }
}
