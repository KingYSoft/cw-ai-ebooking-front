import { ref } from 'vue'
import { useLocale } from 'vuetify'
import { whsOrderSave } from '@/api/whs-order'
import { mapWhsOrderDetailToForm } from '@/composables/mapWhsOrderDetail'
import { useUnsavedInputDataGuard } from '@/composables/useUnsavedInputDataGuard'
import { useAppStore } from '@/stores/app'

export const WHS_ORDER_RECOGNIZE_STORAGE_KEY = 'warehouse_order_recognize_prefill'

function createDefaultWhsOrderFormData() {
  return {
    id: 0,
    pk: '',
    wso_transport_mode: 'SEA',
    wso_packing_mode: 'FCL',
    wso_trade_type: 'TRADE',
    warehouse_code: '',
    wso_warehouse_pk: '',
    si_cut_off: '',
    wso_cfs_cut_off: '',
    shipper: {},
    consignee: {},
    notify_party: {
      add_address_name: 'SAME AS CONSIGNEE',
    },
    item_list: [],
    container_list: [],
    inbound_list: [],
    outbound_list: [],
    e_docs_list: [],
    wso_unit_of_weight: 'KG',
    wso_actual_chargeable_unit: 'KG',
    wso_volume_weight_unit: 'KG',
    wso_unit_of_volume: 'M3',
    wso_pack_type: 'CTN',
    wso_pack_type_desc: 'Carton',
    notify_party_same_as_consignee: 'Y',
    wso_so_number: '',
    wso_po_number: '',
    wso_actual_chargeable: null,
    wso_volume_weight: null,
  }
}

function pickMappedField(mapped, wsoKey, bkgKey, fallback) {
  return mapped?.[wsoKey] ?? mapped?.[bkgKey] ?? fallback
}

function buildRecognizePrefillForm(mapped) {
  const defaults = createDefaultWhsOrderFormData()
  const notifyParty = mapped?.notify_party ?? { add_address_name: 'SAME AS CONSIGNEE' }
  return {
    ...defaults,
    ...mapped,
    id: 0,
    pk: '',
    shipper: mapped?.shipper || {},
    consignee: mapped?.consignee || {},
    notify_party: notifyParty,
    item_list: mapped?.item_list ?? mapped?.pac_list ?? [],
    container_list: mapped?.container_list || [],
    inbound_list: mapped?.inbound_list || [],
    outbound_list: mapped?.outbound_list || [],
    e_docs_list: mapped?.e_docs_list ?? mapped?.eDocs_list ?? [],
    wso_unit_of_weight: pickMappedField(mapped, 'wso_unit_of_weight', 'bkg_unit_of_weight', 'KG'),
    wso_unit_of_volume: pickMappedField(mapped, 'wso_unit_of_volume', 'bkg_unit_of_volume', 'M3'),
    wso_actual_chargeable_unit: pickMappedField(
      mapped,
      'wso_actual_chargeable_unit',
      'bkg_actual_chargeable_unit',
      'KG',
    ),
    wso_volume_weight_unit: pickMappedField(
      mapped,
      'wso_volume_weight_unit',
      'bkg_volume_weight_unit',
      'KG',
    ),
    wso_pack_type: pickMappedField(mapped, 'wso_pack_type', 'bkg_pack_type', 'CTN'),
    wso_pack_type_desc: pickMappedField(mapped, 'wso_pack_type_desc', 'bkg_pack_type_desc', 'Carton'),
    notify_party_same_as_consignee: notifyParty.add_address_name === 'SAME AS CONSIGNEE' ? 'Y' : 'N',
  }
}

export function applyRecognizePrefillToInputData(inputDataRef, route) {
  if (route?.query?.source !== 'recognize') {
    return false
  }

  const rawRecognize = sessionStorage.getItem(WHS_ORDER_RECOGNIZE_STORAGE_KEY)
  if (!rawRecognize) {
    return false
  }

  try {
    const parsed = JSON.parse(rawRecognize)
    const order = Array.isArray(parsed?.orders) ? parsed.orders[0] : parsed
    const mapped = mapWhsOrderDetailToForm(order) ?? order
    inputDataRef.value = buildRecognizePrefillForm(mapped)
    return true
  } catch (error) {
    console.error('Failed to parse recognize warehouse order data:', error)
    return false
  } finally {
    sessionStorage.removeItem(WHS_ORDER_RECOGNIZE_STORAGE_KEY)
  }
}

/**
 * 编辑 和 新增，公共部分写在这里。
 * @param {*} options
 * @returns
 */
export function useWarehouseBookingForm() {
  const appStore = useAppStore()
  const { t } = useLocale()

  const skeletonLoading = ref(true)
  const cardLoading = ref(false)
  const activedTab = ref(1)

  const defaultData = () => createDefaultWhsOrderFormData()
  // 初始化 表单
  const inputData = ref(defaultData())

  // 注册 inputData 未保存检查；查询完成或保存成功后刷新已保存快照。
  const { markInputDataSaved } = useUnsavedInputDataGuard(inputData)

  // 处理表单验证
  const handleValidationErrors = errors => {
    let errList = []
    if (errors && errors.length > 0) {
      const err = []
      for (let i = 0; i < errors.length; i++) {
        const e = errors[i]
        const msg =
          e.errorMessages && e.errorMessages.length > 0 ? e.errorMessages[0] : 'data valid fail.'

        if (e.id.indexOf('@') >= 0) {
          const tab = e.id.split('@')[0]
          if (!Number.isNaN(Number(tab)) && Number(tab) > 0) {
            err.push({ tab: Number(tab), msg })
          }
        } else {
          err.push({ tab: 1, msg })
        }
      }
      if (err.length > 0) {
        errList = err.map(item => item).sort((a, b) => a.tab - b.tab)
      }
    }
    if (errList.length > 0) {
      activedTab.value = errList[0].tab
      appStore.openMessage({
        content: errList[0].msg,
        color: 'error',
      })
    } else {
      appStore.openMessage({
        content: 'data valid fail.',
        color: 'error',
      })
    }
  }

  const formRefs = ref([])
  const registerFormRefs = el => {
    if (!el) {
      return
    }
    if (!formRefs.value.includes(el)) {
      formRefs.value.push(el)
    }
  }

  const validateAll = async () => {
    for (const refDataForm of formRefs.value) {
      const { valid, errors } = await refDataForm.validate()
      if (!valid) {
        handleValidationErrors(errors)
        return false
      }
    }
    return true
  }

  /**
   * save order inputData
   * @param param0
   */
  const whsOrderSaveHandle = async ({ showMessage = true } = {}) => {
    const { success, data } = await whsOrderSave(inputData.value)

    if (success && data) {
      if (showMessage) {
        appStore.openMessage({
          content: t('$vuetify.custom.app.saveSuccess'),
          color: 'success',
        })
      }

      inputData.value.id = data.id ?? 0
      inputData.value.pk = data.pk
      inputData.value.wso_consign_no = data.wso_consign_no
      markInputDataSaved()
      return true
    }
    return false
  }

  const applyRecognizePrefill = route => applyRecognizePrefillToInputData(inputData, route)

  return {
    inputData,
    skeletonLoading,
    cardLoading,
    activedTab,
    whsOrderSaveHandle,
    handleValidationErrors,
    markInputDataSaved,
    applyRecognizePrefill,
    registerFormRefs,
    validateAll,
  }
}
