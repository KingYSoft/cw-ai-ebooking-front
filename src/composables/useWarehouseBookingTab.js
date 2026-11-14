import { nextTick } from 'vue'

function isWhsDraft(inputData) {
  const status = String(inputData?.wso_status ?? inputData?.wso_shipment_status ?? '')
    .trim()
    .toLowerCase()
  return status === 'draft'
}

export function resolveWhsConsignNo({ route, inputData } = {}) {
  return String(
    inputData?.wso_consign_no ??
      inputData?.wso_temp_number ??
      inputData?.bkg_consign_no ??
      route?.query?.shipment_no ??
      '',
  ).trim()
}

export function formatWhsTabTitle(consignNo) {
  return consignNo ? `WHS-${consignNo}` : 'WHS-'
}

export function syncWhsBookingTab(appStore, { tabValue, route, router, inputData }) {
  const consignNo = resolveWhsConsignNo({ route, inputData })
  const isEdit = route.name === 'warehouse_booking_edit-pk'
  const params = isEdit ? { pk: route.params.pk } : {}
  const query = {
    ...route.query,
    shipment_no: consignNo || undefined,
  }

  appStore.event.trigger('replaceBookingEditTab', {
    oldTabValue: tabValue,
    newTabValue: tabValue,
    title: formatWhsTabTitle(consignNo),
    to: {
      name: route.name,
      params,
      query,
    },
    params,
    query,
  })

  if (router && consignNo && route.query.shipment_no !== consignNo) {
    router.replace({ query })
  }
}

export function scheduleWhsBookingTabSync(appStore, options) {
  nextTick(() => syncWhsBookingTab(appStore, options))
}
