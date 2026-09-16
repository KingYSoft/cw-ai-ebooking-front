import Decimal from 'decimal.js'
import { ref } from 'vue'
import { useLocale } from 'vuetify'
import { bookingSave } from '@/api/booking'
import { useUnsavedInputDataGuard } from '@/composables/useUnsavedInputDataGuard'
import { useAppStore } from '@/stores/app'

const toDecimal = value => {
  const text = String(value ?? '')
    .trim()
    .replace(/,/g, '')
  if (text === '') {
    return new Decimal(0)
  }
  try {
    return new Decimal(text)
  } catch {
    return new Decimal(0)
  }
}

const BOOKING_PAC_REMAINDER_FIELDS = [
  { header: 'bkg_total_package_count', row: 'pac_package_count', digits: 0 },
  { header: 'bkg_actual_weight', row: 'pac_gross_weight', digits: 5 },
  { header: 'bkg_actual_volume', row: 'pac_actual_volume', digits: 5 },
]

const getBookingPacRowRemainderFields = inputData => {
  const rows = inputData?.pac_list ?? []
  return BOOKING_PAC_REMAINDER_FIELDS.reduce((fields, { header, row, digits }) => {
    const total = rows.reduce((sum, item) => sum.plus(toDecimal(item?.[row])), new Decimal(0))
    const remainder = toDecimal(inputData?.[header]).minus(total)
    const safeRemainder = remainder.isNegative() ? new Decimal(0) : remainder
    fields[row] = safeRemainder.toDecimalPlaces(digits, Decimal.ROUND_HALF_UP).toNumber()
    return fields
  }, {})
}

/**
 * 编辑 和 新增，公共部分写在这里。
 * @param {*} options
 * @returns
 */
export function useFreightBookingForm() {
  const appStore = useAppStore()
  const { t } = useLocale()

  const skeletonLoading = ref(true)
  const cardLoading = ref(false)
  const activedTab = ref(1)

  const defaultData = () => ({
    id: 0,
    pk: '',
    bkg_transport_mode: 'SEA',
    bkg_packing_mode: 'FCL',
    shipper: {},
    consignee: {},
    pickup: {},
    notify_party: {
      add_address_name: 'SAME AS CONSIGNEE',
    },
    pac_list: [],
    e_docs_list: [],
    bkg_unit_of_weight: 'KG',
    bkg_actual_chargeable_unit: 'KG',
    bkg_volume_weight_unit: 'KG',
    bkg_unit_of_volume: 'M3',
    bkg_pack_type: 'CTN',
    bkg_pack_type_desc: 'Carton',
    notify_party_same_as_consignee: 'Y',
    bkg_so_number: '',
    bkg_po_number: '',
    bkg_actual_chargeable: null,
    bkg_volume_weight: null,
    bkg_load_port: '',
    bkg_load_port_name: '',
    bkg_discharge_port: '',
    bkg_discharge_port_name: '',
    bkg_intended_vessel: '',
    bkg_voyage: '',
    doc_data: {},
  })
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
          const tab = e.id.split('@', 1)[0]
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

  /**
   * save order inputData
   * @param param0
   */
  const bookingSaveHandle = async ({ showMessage = true } = {}) => {
    const { success, data } = await bookingSave(inputData.value)

    if (success && data) {
      if (showMessage) {
        appStore.openMessage({
          content: t('$vuetify.custom.app.saveSuccess'),
          color: 'success',
        })
      }

      inputData.value.id = data.id ?? 0
      inputData.value.pk = data.pk
      inputData.value.bkg_consign_no = data.bkg_consign_no
      markInputDataSaved()
      return true
    }
    return false
  }

  const addNewContainer = () => {
    if (!inputData.value) {
      return
    }
    if (!Array.isArray(inputData.value.pac_list)) {
      inputData.value.pac_list = []
    }
    const remainderFields = getBookingPacRowRemainderFields(inputData.value)
    inputData.value.pac_list.push({
      id: Date.now(),
      pac_container_count: 1,
      pac_pack_type: inputData.value.bkg_pack_type,
      pac_weight_unit: inputData.value.bkg_unit_of_weight,
      pac_actual_volume_uom: inputData.value.bkg_unit_of_volume,
      pac_volume_weight: inputData.value.bkg_volume_weight,
      pac_volume_weight_unit: inputData.value.bkg_volume_weight_unit,
      pac_chargeable_weight: inputData.value.bkg_actual_chargeable,
      pac_chargeable_weight_unit: inputData.value.bkg_actual_chargeable_unit,
      pac_pack_type_desc: inputData.value.bkg_pack_type_desc,
      ...remainderFields,
    })
  }

  const removeNewContainer = index => {
    inputData.value.pac_list.splice(index, 1)
  }
  return {
    inputData,
    skeletonLoading,
    cardLoading,
    activedTab,
    bookingSaveHandle,
    handleValidationErrors,
    markInputDataSaved,
    addNewContainer,
    removeNewContainer,
  }
}
