import { onBeforeUnmount, ref } from 'vue'
import { previewFile } from '@/api/files'
import { shipmentPdfGenerate } from '@/api/shipment'
import { useWarehouseOrderPageI18n } from '@/composables/useWarehouseOrderPageI18n'
import { useAppStore } from '@/stores/app'

const WHS_PRINT_TEMPLATE_CODE = 'PDF_WHS_000001'

export function useWhsOrderPrint() {
  const appStore = useAppStore()
  const { edit, editMessage } = useWarehouseOrderPageI18n()

  const pdfTitle = ref(edit('printTitle'))
  const pdfUrl = ref('')
  const pdfDiaVis = ref(false)
  const printingPk = ref('')
  let previewObjectUrl = ''

  const revokePreviewUrl = () => {
    if (previewObjectUrl) {
      URL.revokeObjectURL(previewObjectUrl)
      previewObjectUrl = ''
    }
    pdfUrl.value = ''
  }

  const closePdfPreview = () => {
    pdfDiaVis.value = false
    revokePreviewUrl()
  }

  onBeforeUnmount(() => {
    revokePreviewUrl()
  })

  const hasCarrierSoNumber = order =>
    Boolean(String(order?.bkg_so_number ?? order?.wso_so_number ?? '').trim())

  const generateWhsOrderPdf = async order => {
    const businessId = order?.id
    const businessPk = String(order?.pk ?? '').trim()
    if (!businessId || !businessPk) {
      appStore.openMessage({
        content: editMessage('generatePdfFailed'),
        color: 'warning',
      })
      return false
    }

    try {
      printingPk.value = businessPk
      appStore.openGlobalLoadingWithIcon(editMessage('generating'), 'mdi-file-pdf-box', 'info')
      const { success, data } = await shipmentPdfGenerate({
        business_id: businessId,
        business_pk: businessPk,
        template_code: WHS_PRINT_TEMPLATE_CODE,
        version_no: 'v1',
      })
      if (!success || !data?.document_pk || !data?.document_source) {
        appStore.openMessage({
          content: editMessage('generatePdfFailed'),
          color: 'error',
        })
        return false
      }

      const blob = await previewFile({
        document_source: data.document_source,
        document_pk: data.document_pk,
      })
      revokePreviewUrl()
      previewObjectUrl = URL.createObjectURL(blob)
      pdfUrl.value = previewObjectUrl
      pdfDiaVis.value = true
      return true
    } catch (error) {
      console.log(error)
      appStore.openMessage({
        content: editMessage('generatePdfFailed'),
        color: 'error',
      })
      return false
    } finally {
      printingPk.value = ''
      appStore.closeGlobalLoading()
    }
  }

  const onPrintWhsOrder = async order => {
    if (!hasCarrierSoNumber(order)) {
      appStore.openMessage({
        content: editMessage('carrierSoRequiredForPrint'),
        color: 'warning',
      })
      return
    }

    await generateWhsOrderPdf(order)
  }

  return {
    pdfTitle,
    pdfUrl,
    pdfDiaVis,
    printingPk,
    closePdfPreview,
    hasCarrierSoNumber,
    onPrintWhsOrder,
  }
}
