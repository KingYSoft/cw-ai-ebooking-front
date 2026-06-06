let nextId = 5

const emptyParty = () => ({
  add_address_name: '',
  add_address_code: '',
  add_address1: '',
  add_address2: '',
  add_address3: '',
  add_phone: '',
  add_fax: '',
})

export const defaultBookingForm = () => ({
  pk: '',
  id: 0,
  freight_status: 'draft',
  bkg_transport_mode: 'SEA',
  bkg_packing_mode: 'FCL',
  shipper: emptyParty(),
  consignee: emptyParty(),
  notify_party: { add_address_name: 'SAME AS CONSIGNEE' },
  notify_party_same_as_consignee: 'Y',
  pickup: emptyParty(),
  bkg_fcl_cut_off_date: '2026-06-07 15:00:00',
  bkg_oog_cut_off_date: '2026-06-07 16:00:00',
  bkg_reefer_cut_off_date: '2026-06-07 17:00:00',
  bkg_dg_cut_off_date: '2026-06-07 18:00:00',
  bkg_vgm_cut_off_date: '2026-06-07 19:00:00',
  bkg_doc_cut_off_date: '2026-06-07 20:00:00',
  bkg_origin: '',
  bkg_destination: '',
  bkg_etd: '',
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

function enrichListRow(item) {
  return {
    ...item,
    shipper_name: item.shipper_name ?? item.shipper?.add_address_name ?? null,
    consignee_name: item.consignee_name ?? item.consignee?.add_address_name ?? null,
    job_status: item.job?.job_status ?? item.job_status ?? 'Open',
    booking_status: item.booking_status ?? 'submitted',
    bkg_booking_reference: item.bkg_booking_reference ?? '',
  }
}

export const mockBookings = [
  enrichListRow({
    pk: '1',
    id: 1,
    freight_status: 'saved',
    bkg_transport_mode: 'SEA',
    bkg_packing_mode: 'FCL',
    bkg_consign_no: 'EBK2025001',
    bkg_booking_reference: 'BK-2025001',
    booking_status: 'submitted',
    bkg_house_bill: 'HBL001',
    shipper: { add_address_name: 'ABC Trading Co.', add_address_code: 'ABC001', add_address1: '88 Export Rd', add_address2: 'address2', add_address3: 'address3', add_phone: '1234567890', add_fax: '1234567890' },
    consignee: { add_address_name: 'XYZ Logistics Ltd.', add_address_code: 'XYZ001', add_address1: '12 Harbor St', add_address2: 'address2', add_address3: 'address3', add_phone: '1234567890', add_fax: '1234567890' },
    notify_party: { add_address_name: 'SAME AS CONSIGNEE' },
    notify_party_same_as_consignee: 'Y',
    bkg_origin: 'CNSHA',
    bkg_destination: 'USLAX',
    bkg_cargo_ready: '2025-05-01',
    bkg_etd: '2025-05-20',
    bkg_eta: '2025-05-28',
    bkg_fcl_cut_off_date: '2026-06-07 15:00:00',
    bkg_oog_cut_off_date: '2026-06-07 16:00:00',
    bkg_reefer_cut_off_date: '2026-06-07 17:00:00',
    bkg_dg_cut_off_date: '2026-06-07 18:00:00',
    bkg_vgm_cut_off_date: '2026-06-07 19:00:00',
    bkg_doc_cut_off_date: '2026-06-07 20:00:00',
    bkg_actual_weight: 12_500,
    bkg_actual_volume: 28.5,
    bkg_freight_terms: 'PP',
    bkg_inco: 'FOB',
    bkg_preferred_carrier: 'MAERSK',
    bkg_release_type: 'OBL',
    bkg_commodity: 'General Cargo',
    bkg_goods_description: 'Electronic parts',
    bkg_marks_nos: 'N/M',
    pac_list: [
      {
        id: 1,
        pac_container_type: '40HC',
        pac_container_count: 2,
        pac_container_num: '',
        pac_seal_num: '',
        pac_is_soc: false,
      },
    ],
    job: { job_status: 'Open' },
  }),
  enrichListRow({
    pk: '2',
    id: 2,
    freight_status: 'submitted',
    bkg_transport_mode: 'AIR',
    bkg_packing_mode: 'LSE',
    bkg_consign_no: 'EBK2025002',
    bkg_booking_reference: 'BK-2025002',
    booking_status: 'confirmed',
    bkg_house_bill: 'HBL002',
    shipper: { add_address_name: 'Global Export Inc.', add_address1: 'Unit 5', add_address2: '', add_address3: '' },
    consignee: { add_address_name: 'Pacific Import Pte', add_address1: 'Airport Blvd', add_address2: '', add_address3: '' },
    bkg_origin: 'HKHKG',
    bkg_destination: 'SGSIN',
    bkg_cargo_ready: '2025-05-05',
    bkg_etd: '2025-05-30',
    bkg_eta: '2025-05-13',
    bkg_actual_weight: 850,
    bkg_actual_volume: 4.2,
    bkg_freight_terms: 'CC',
    bkg_inco: 'CIF',
    job: { job_status: 'Confirmed' },
  }),
  enrichListRow({
    pk: '3',
    id: 3,
    freight_status: 'draft',
    bkg_transport_mode: 'SEA',
    bkg_packing_mode: 'LCL',
    bkg_consign_no: 'EBK2025003',
    bkg_booking_reference: 'BK-2025003',
    booking_status: 'under_review',
    bkg_house_bill: 'HBL003',
    shipper: { add_address_name: 'East Wind Manufacturing', add_address1: '', add_address2: '', add_address3: '' },
    consignee: { add_address_name: 'Euro Freight GmbH', add_address1: '', add_address2: '', add_address3: '' },
    bkg_origin: 'CNNGB',
    bkg_destination: 'DEHAM',
    bkg_cargo_ready: '2025-05-08',
    bkg_etd: '2025-05-18',
    bkg_eta: '2025-06-20',
    bkg_actual_weight: 3200,
    bkg_actual_volume: 12,
    bkg_freight_terms: 'PP',
    bkg_inco: 'EXW',
    job: { job_status: 'Open' },
  }),
]

export function mapBookingToForm(row) {
  if (!row) {
    return defaultBookingForm()
  }
  return {
    ...defaultBookingForm(),
    ...row,
    shipper: { ...emptyParty(), ...row.shipper },
    consignee: { ...emptyParty(), ...row.consignee },
    notify_party: row.notify_party || { add_address_name: 'SAME AS CONSIGNEE' },
    notify_party_same_as_consignee: row.notify_party_same_as_consignee ?? 'Y',
    pickup: { ...emptyParty(), ...row.pickup },
    pac_list: Array.isArray(row.pac_list) ? row.pac_list.map((p, i) => ({ ...p, id: p.id ?? i + 1 })) : [],
    job: row.job || { job_status: row.job_status || 'Open' },
  }
}

export function mapFormToBooking(form) {
  const consignNo =
    form.bkg_consign_no ||
    `EBK${new Date().getFullYear()}${String(nextId).padStart(4, '0')}`

  return {
    ...form,
    bkg_consign_no: consignNo,
    shipper_name: form.shipper?.add_address_name,
    consignee_name: form.consignee?.add_address_name,
    freight_status: form.freight_status || 'draft',
    job: { job_status: form.job?.job_status || 'Open' },
  }
}

export function getMockBookingByPk(pk) {
  return mockBookings.find(item => String(item.pk) === String(pk))
}

export function addMockBooking(row) {
  const id = nextId++
  const item = enrichListRow(
    mapFormToBooking({
      ...defaultBookingForm(),
      ...row,
      pk: String(id),
      id,
      freight_status: 'saved',
    }),
  )
  mockBookings.unshift(item)
  return item
}

export function updateMockBooking(pk, row) {
  const idx = mockBookings.findIndex(item => String(item.pk) === String(pk))
  if (idx < 0) {
    return null
  }
  mockBookings[idx] = enrichListRow({ ...mockBookings[idx], ...mapFormToBooking(row), pk: String(pk) })
  return mockBookings[idx]
}

export function queryMockBookings({ skipCount = 0, maxResultCount = 2000, statusFilter = [] } = {}) {
  let rows = [...mockBookings]
  if (Array.isArray(statusFilter) && statusFilter.length > 0) {
    rows = rows.filter(row => statusFilter.includes(row.booking_status))
  }
  const totalCount = rows.length
  const items = rows.slice(skipCount, skipCount + maxResultCount).map((item, index) => ({
    ...enrichListRow(item),
    index: skipCount + index + 1,
  }))

  return { items, totalCount }
}
