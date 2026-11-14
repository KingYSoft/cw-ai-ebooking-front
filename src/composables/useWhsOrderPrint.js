import { onBeforeUnmount, ref } from 'vue'
import { previewFile, previewFileByPath } from '@/api/files'
import { shipmentPdfGenerate } from '@/api/shipment'
import { useWarehouseOrderPageI18n } from '@/composables/useWarehouseOrderPageI18n'
import { useAppStore } from '@/stores/app'

const WHS_PRINT_TEMPLATE_CODES = {
  SHIPPING_ORDER: 'PDF_WHS_000001',
  SI: 'PDF_WHS_000002',
  CR: 'PDF_WHS_000003',
  DI: 'PDF_WHS_000004',
}

const getPdfTitle = (templateCode, defaultTitle) => {
  switch (templateCode) {
    case WHS_PRINT_TEMPLATE_CODES.SI: {
      return 'SI FORM'
    }
    case WHS_PRINT_TEMPLATE_CODES.CR: {
      return 'CR FORM'
    }
    case WHS_PRINT_TEMPLATE_CODES.DI: {
      return 'DI FORM'
    }
    // case WHS_PRINT_TEMPLATE_CODES.SHIPPING_ORDER:
    default: {
      return defaultTitle
    }
  }
}

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

  const resolvePdfBlob = async data => {
    const pdfPath = String(data?.pdfPath ?? data?.pdf_path ?? '').trim()
    if (pdfPath) {
      return previewFileByPath(pdfPath)
    }

    if (data?.document_pk && data?.document_source) {
      return previewFile({
        document_source: data.document_source,
        document_pk: data.document_pk,
      })
    }

    return null
  }

  const generateWhsOrderPdf = async (
    order,
    templateCode = WHS_PRINT_TEMPLATE_CODES.SHIPPING_ORDER,
  ) => {
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
        template_code: templateCode,
        version_no: 'v1',
      })
      if (!success || !data) {
        appStore.openMessage({
          content: editMessage('generatePdfFailed'),
          color: 'error',
        })
        return false
      }

      const blob = await resolvePdfBlob(data)
      if (!blob) {
        appStore.openMessage({
          content: editMessage('generatePdfFailed'),
          color: 'error',
        })
        return false
      }

      revokePreviewUrl()
      pdfTitle.value = getPdfTitle(templateCode, edit('printTitle'))
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

  const onPrintWhsOrder = async (order, templateCode = WHS_PRINT_TEMPLATE_CODES.SHIPPING_ORDER) => {
    // 原 Shipping Order 保留 Carrier SO 校验；SI / CR / DI 不增加此限制。
    if (templateCode === WHS_PRINT_TEMPLATE_CODES.SHIPPING_ORDER && !hasCarrierSoNumber(order)) {
      appStore.openMessage({
        content: editMessage('carrierSoRequiredForPrint'),
        color: 'warning',
      })
      return
    }

    await generateWhsOrderPdf(order, templateCode)
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
