import { ref } from 'vue'
import { useLocale } from 'vuetify'
import { whsOrderSave } from '@/api/whs-order'
import { useUnsavedInputDataGuard } from '@/composables/useUnsavedInputDataGuard'
import { useAppStore } from '@/stores/app'

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

  const defaultData = () => ({
    id: 0,
    pk: '',
    wso_transport_mode: 'SEA',
    wso_packing_mode: 'FCL',
    shipper: {},
    consignee: {},
    notify_party: {
      add_address_name: 'SAME AS CONSIGNEE',
    },
    item_list: [],
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
      markInputDataSaved()
      return true
    }
    return false
  }

  return {
    inputData,
    skeletonLoading,
    cardLoading,
    activedTab,
    whsOrderSaveHandle,
    handleValidationErrors,
    markInputDataSaved,
  }
}
