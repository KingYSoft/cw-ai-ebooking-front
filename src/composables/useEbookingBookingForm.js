import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import {
  addMockBooking,
  getMockBookingByPk,
  mapBookingToForm,
  mapFormToBooking,
  updateMockBooking,
} from '@/mock/booking'
import { useAppStore } from '@/stores/app'

export function useEbookingBookingForm(options = {}) {
  const { isEditMode = false } = options
  const router = useRouter()
  const route = useRoute()
  const appStore = useAppStore()

  const skeletonLoading = ref(false)
  const cardLoading = ref(false)
  const activedTab = ref(1)
  const defaultData = () => ({
    pk: '',
    id: 0,
    freight_status: 'draft',
    bkg_transport_mode: 'SEA',
    bkg_packing_mode: 'FCL',
    shipper: { add_address_name: '测试', add_address_code: '测试', add_address1: '地址1', add_address2: '地址2', add_address3: '地址3' },
    consignee: { add_address_name: '测试', add_address_code: '测试', add_address1: '地址1', add_address2: '地址2', add_address3: '地址3' },
    notify_party: { add_address_name: 'SAME AS CONSIGNEE' },
    notify_party_same_as_consignee: 'Y',
    pickup: { add_address_name: '测试', add_address_code: '测试', add_address1: '地址1', add_address2: '地址2', add_address3: '地址3', add_phone: '1234567890', add_fax: '1234567890' },
    bkg_fcl_cut_off_date: '2026-06-07 15:00:00',
    bkg_oog_cut_off_date: '2026-06-07 16:00:00',
    bkg_reefer_cut_off_date: '2026-06-07 17:00:00',
    bkg_dg_cut_off_date: '2026-06-07 18:00:00',
    bkg_vgm_cut_off_date: '2026-06-07 19:00:00',
    bkg_doc_cut_off_date: '2026-06-07 20:00:00',
    bkg_origin: '',
    bkg_destination: '',
    bkg_etd: appStore.utils.formatDate(new Date()),
    bkg_eta: '',
    bkg_cargo_ready: '',
    bkg_actual_weight: null,
    bkg_unit_of_weight: 'KG',
    bkg_actual_volume: null,
    bkg_unit_of_volume: 'M3',
    bkg_volume_weight: null,
    bkg_volume_weight_unit: 'KG',
    bkg_actual_chargeable: null,
    bkg_actual_chargeable_unit: 'KG',
    bkg_total_package_count: null,
    bkg_pack_type: 'CTN',
    bkg_inco: 'FOB',
    bkg_freight_terms: 'PP',
    bkg_preferred_carrier: '',
    bkg_release_type: '',
    bkg_service_level: '',
    bkg_delivery_mode: 'CY/CY',
    bkg_commodity: '',
    bkg_goods_value: null,
    bkg_goods_value_currency: 'USD',
    bkg_insurance_value: null,
    bkg_insurance_value_currency: 'USD',
    bkg_goods_description: '',
    bkg_marks_nos: '',
    bkg_booking_reference: '',
    bkg_additional_terms: '',
    pac_list: [],
    job: { job_status: 'Open' },
  })

  const inputData = ref(defaultData())

  const loadData = () => {
    if (!isEditMode) {
      inputData.value = defaultData()
      return
    }
    const row = getMockBookingByPk(route.params.pk)
    if (!row) {
      appStore.openMessage({ content: 'Booking not found.', color: 'warning' })
      router.push({ name: 'booking' })
      return
    }
    inputData.value = mapBookingToForm(row)
  }

  const onSave = async () => {
    cardLoading.value = true
    try {
      const payload = mapFormToBooking(inputData.value)
      if (isEditMode) {
        updateMockBooking(route.params.pk, payload)
        inputData.value.freight_status = inputData.value.freight_status === 'draft' ? 'saved' : inputData.value.freight_status
        appStore.openMessage({ content: 'Booking saved.', color: 'success' })
      } else {
        const created = addMockBooking(payload)
        appStore.openMessage({ content: 'Booking created.', color: 'success' })
        router.push({ name: 'booking_edit-pk', params: { pk: created.pk } })
      }
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
