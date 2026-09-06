import { ref } from 'vue'
import { useLocale } from 'vuetify'
import { bookingSave } from '@/api/booking'
import { useUnsavedInputDataGuard } from '@/composables/useUnsavedInputDataGuard'
import { useAppStore } from '@/stores/app'

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
    inputData.value.pac_list.push({
      id: Date.now(),
      pac_container_type: '20GP',
      pac_container_count: 1,
      pac_container_num: '',
      pac_seal_num: '',
      pac_is_soc: 0,
      pac_commodity: '',
      pac_gross_weight: null,
      pac_weight_unit: 'KG',
      pac_actual_volume: null,
      pac_actual_volume_uom: 'M3',
      pac_package_count: null,
      pac_pack_type: 'PKG',
      pac_pack_type_desc: 'Package',
      pac_harmonised_code: '',
      pac_goods_description: '',
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
