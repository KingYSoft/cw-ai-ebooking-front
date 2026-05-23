import { mapWhsOrderDetailToForm } from '@/composables/mapWhsOrderDetail'

let nextId = 4

const emptyParty = () => ({
  add_address_name: '',
  add_address_code: '',
  add_address1: '',
  add_address2: '',
  add_address3: '',
})

function buildDetailRow(base) {
  return {
    ...base,
    wso_packing_mode: base.wso_shipment_type,
    bkg_transport_mode: base.wso_transport_mode,
    bkg_packing_mode: base.wso_shipment_type,
    bkg_consign_no: base.wso_consign_no,
    bkg_house_bill: base.wso_house_bill,
    bkg_booking_reference: base.wso_booking_reference,
    bkg_goods_description: base.wso_goods_description,
    bkg_origin: base.wso_origin,
    bkg_destination: base.wso_destination,
    bkg_delivery_due_date: base.wso_delivery_due_date,
    bkg_cargo_ready: base.wso_cargo_ready,
    bkg_etd: base.wso_etd,
    bkg_eta: base.wso_eta,
    bkg_actual_weight: base.wso_actual_weight,
    bkg_actual_volume: base.wso_actual_volume,
    bkg_actual_chargeable: base.wso_actual_chargeable,
    bkg_total_package_count: base.wso_total_package_count,
    bkg_unit_of_weight: 'KG',
    bkg_unit_of_volume: 'M3',
    bkg_volume_weight_unit: 'KG',
    bkg_actual_chargeable_unit: 'M3',
    bkg_pack_type: 'CTN',
    bkg_pack_type_desc: 'Carton',
    bkg_freight_terms: 'PP',
    bkg_inco: 'FOB',
    bkg_release_type: 'OBL',
    bkg_delivery_mode: 'CY/CY',
    notify_party_same_as_consignee: 'Y',
    shipper: {
      ...emptyParty(),
      add_address_name: base.shipper_name ?? 'ABC Trading Co.',
      add_address1: '88 Export Rd',
    },
    consignee: {
      ...emptyParty(),
      add_address_name: base.consignee_name ?? 'XYZ Logistics Ltd.',
      add_address1: '12 Harbor St',
    },
    notify_party: { add_address_name: 'SAME AS CONSIGNEE' },
    pickup: emptyParty(),
    delivery: emptyParty(),
    pac_list: base.pac_list ?? [],
    inbound_list: [],
    outbound_list: [],
    eDocs_list: [],
    job: { job_status: base.wso_shipment_status ?? 'Open' },
  }
}

export const mockWhsOrders = [
  buildDetailRow({
    pk: '1',
    id: 1,
    wso_shipment_status: 'Open',
    wso_consign_no: 'WHO2025001',
    wso_transport_mode: 'SEA',
    wso_shipment_type: 'FCL',
    wso_house_bill: 'HBL-WHO001',
    wso_so_number: 'SO-10001',
    wso_booking_reference: 'BK-90001',
    wso_goods_description: 'Electronic parts',
    wso_origin: 'CNSHA',
    wso_destination: 'USLAX',
    wso_delivery_due_date: '2025-06-01',
    wso_cargo_ready: '2025-05-01',
    wso_etd: '2025-05-20',
    wso_eta: '2025-05-28',
    wso_actual_weight: 12_500,
    wso_actual_volume: 28.5,
    wso_actual_chargeable: 12_500,
    wso_total_package_count: 120,
    shipper_name: 'ABC Trading Co.',
    consignee_name: 'XYZ Logistics Ltd.',
    create_user: 'admin',
    last_modify_user: 'admin',
    pac_list: [
      {
        id: 1,
        item_code: 'ITEM-001',
        description: 'Electronic parts',
        gross_weight: 500,
        volume: 2.5,
        package_count: 10,
        pac_pack_type: 'CTN',
      },
    ],
  }),
  buildDetailRow({
    pk: '2',
    id: 2,
    wso_shipment_status: 'Confirmed',
    wso_consign_no: 'WHO2025002',
    wso_transport_mode: 'AIR',
    wso_shipment_type: 'LSE',
    wso_house_bill: 'HBL-WHO002',
    wso_so_number: 'SO-10002',
    wso_booking_reference: 'BK-90002',
    wso_goods_description: 'Garments',
    wso_origin: 'HKHKG',
    wso_destination: 'SGSIN',
    wso_delivery_due_date: '2025-05-15',
    wso_cargo_ready: '2025-05-05',
    wso_etd: '2025-05-10',
    wso_eta: '2025-05-12',
    wso_actual_weight: 850,
    wso_actual_volume: 4.2,
    wso_actual_chargeable: 900,
    wso_total_package_count: 45,
    shipper_name: 'Global Export Inc.',
    consignee_name: 'Pacific Import Pte',
    create_user: 'user01',
    last_modify_user: 'user01',
    pac_list: [],
  }),
  buildDetailRow({
    pk: '3',
    id: 3,
    wso_shipment_status: 'Draft',
    wso_consign_no: 'WHO2025003',
    wso_transport_mode: 'SEA',
    wso_shipment_type: 'LCL',
    wso_house_bill: 'HBL-WHO003',
    wso_so_number: 'SO-10003',
    wso_booking_reference: 'BK-90003',
    wso_goods_description: 'Machinery spare parts',
    wso_origin: 'CNNGB',
    wso_destination: 'DEHAM',
    wso_delivery_due_date: '2025-06-20',
    wso_cargo_ready: '2025-05-08',
    wso_etd: '2025-05-18',
    wso_eta: '2025-06-20',
    wso_actual_weight: 3200,
    wso_actual_volume: 12,
    wso_actual_chargeable: 3500,
    wso_total_package_count: 80,
    shipper_name: 'East Wind Manufacturing',
    consignee_name: 'Euro Freight GmbH',
    create_user: 'user02',
    last_modify_user: 'user02',
    pac_list: [],
  }),
]

export function queryMockWhsOrders({ skipCount = 0, maxResultCount = 50 } = {}) {
  const totalCount = mockWhsOrders.length
  const items = mockWhsOrders.slice(skipCount, skipCount + maxResultCount).map((item, index) => ({
    ...item,
    index: skipCount + index + 1,
  }))

  return { items, totalCount }
}

export function getMockWhsOrderByPk(pk) {
  return mockWhsOrders.find(item => String(item.pk) === String(pk)) ?? null
}

export function getMockWhsOrderFormByPk(pk) {
  const row = getMockWhsOrderByPk(pk)
  if (!row) {
    return null
  }
  return mapWhsOrderDetailToForm(row)
}

export function saveMockWhsOrder(payload) {
  const pk = String(payload.pk ?? '').trim()
  if (pk) {
    const idx = mockWhsOrders.findIndex(item => String(item.pk) === pk)
    if (idx >= 0) {
      const merged = buildDetailRow({
        ...mockWhsOrders[idx],
        ...payload,
        wso_consign_no: payload.wso_consign_no ?? mockWhsOrders[idx].wso_consign_no,
        wso_shipment_type: payload.wso_shipment_type ?? mockWhsOrders[idx].wso_shipment_type,
        pac_list: payload.item_list ?? payload.pac_list ?? mockWhsOrders[idx].pac_list,
      })
      mockWhsOrders[idx] = merged
      return {
        success: true,
        data: {
          id: merged.id,
          pk: merged.pk,
          wso_consign_no: merged.wso_consign_no,
          shipment_no: merged.wso_consign_no,
        },
      }
    }
  }

  const id = nextId++
  const consignNo =
    payload.wso_consign_no ||
    `WHO${new Date().getFullYear()}${String(id).padStart(4, '0')}`
  const item = buildDetailRow({
    ...payload,
    pk: String(id),
    id,
    wso_consign_no: consignNo,
    wso_shipment_status: payload.wso_shipment_status ?? 'Open',
    pac_list: payload.item_list ?? payload.pac_list ?? [],
  })
  mockWhsOrders.unshift(item)
  return {
    success: true,
    data: {
      id: item.id,
      pk: item.pk,
      wso_consign_no: item.wso_consign_no,
      shipment_no: item.wso_consign_no,
    },
  }
}
