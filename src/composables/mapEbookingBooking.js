const emptyParty = () => ({
  add_address: null,
  add_address_name: '',
  add_address_code: '',
  add_address1: '',
  add_address2: '',
  add_address3: '',
  add_phone: '',
  add_fax: '',
})

/** Swagger BookingSaveInput 允许的 bkg_* 字段 */
const BOOKING_SAVE_BKG_KEYS = [
  'bkg_is_cancelled',
  'bkg_transport_mode',
  'bkg_shipment_status',
  'bkg_phase',
  'bkg_consign_no',
  'bkg_cargo_receipt',
  'bkg_consol_reference',
  'bkg_house_bill',
  'bkg_shipment_type',
  'bkg_is_forward_registered',
  'bkg_booking_reference',
  'bkg_goods_description',
  'bkg_marks_nos',
  'bkg_goods_value',
  'bkg_goods_value_currency',
  'bkg_insurance_value',
  'bkg_packing_order',
  'bkg_release_type',
  'bkg_export_depot_address',
  'bkg_import_depot_address',
  'bkg_booking_party',
  'bkg_tranship_agent_name',
  'bkg_delivery_agent_name',
  'bkg_a_rcv',
  'bkg_etd',
  'bkg_eta',
  'bkg_cargo_ready',
  'bkg_est_pickup',
  'bkg_est_delivery',
  'bkg_client_requested_eta',
  'bkg_freight_terms',
  'bkg_service_level',
  'bkg_inco',
  'bkg_additional_terms',
  'bkg_packing_mode',
  'bkg_actual_volume',
  'bkg_unit_of_volume',
  'bkg_actual_weight',
  'bkg_unit_of_weight',
  'bkg_actual_chargeable',
  'bkg_actual_chargeable_unit',
  'bkg_volume_weight',
  'bkg_volume_weight_unit',
  'bkg_volume_factor',
  'bkg_total_package_count',
  'bkg_outer_packs',
  'bkg_pack_type',
  'bkg_pack_type_desc',
  'bkg_shipped_on_board',
  'bkg_shipped_on_board_date',
  'bkg_delivery_mode',
  'bkg_warehouse_location',
  'bkg_coload_master_shipment',
  'bkg_split_switch_shipment',
  'bkg_is_split_shipment',
  'bkg_one_time_quote',
  'bkg_origin',
  'bkg_origin_name',
  'bkg_destination',
  'bkg_destination_name',
  'bkg_place_of_receipt',
  'bkg_place_of_receipt_name',
  'bkg_place_of_delivery',
  'bkg_place_of_delivery_name',
  'bkg_load_port',
  'bkg_load_port_name',
  'bkg_discharge_port',
  'bkg_discharge_port_name',
  'bkg_intended_vessel',
  'bkg_voyage',
  'bkg_carrier_contract_number',
  'bkg_preferred_carrier',
  'bkg_preferred_carrier_name',
  'bkg_booking_allocation_line',
  'bkg_container_load_plan',
  'bkg_company_tariff_level',
  'bkg_supplier_booking',
  'bkg_commodity',
  'bkg_gateway_service_level',
  'bkg_delivery_due_date',
  'bkg_transit_time',
  'bkg_transit_time_unit',
  'bkg_job_rep_sales',
  'bkg_job_rep_sales_name',
  'bkg_job_rep_ops',
  'bkg_job_rep_ops_name',
  'bkg_job_rep_cs',
  'bkg_job_rep_cs_name',
  'create_user',
  'last_modify_user',
  'bkg_so_confirm_date',
  'bkg_vgm_cut_off_date',
  'bkg_doc_cut_off_date',
  'bkg_port_cargo_cut_off_date',
  'bkg_so_number',
  'bkg_po_number',
  'bkg_dagent_fee',
  'bkg_org_header_pk',
  'bkg_agent_org_header_pk',
  'bkg_consignee_org_header_pk',
  'bkg_shipper_org_header_pk',
]

export function createDefaultBookingForm(appStore) {
  return {
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
    bkg_fcl_cut_off_date: '',
    bkg_oog_cut_off_date: '',
    bkg_reefer_cut_off_date: '',
    bkg_dg_cut_off_date: '',
    bkg_vgm_cut_off_date: '',
    bkg_doc_cut_off_date: '',
    bkg_origin: '',
    bkg_destination: '',
    bkg_load_port: '',
    bkg_load_port_name: '',
    bkg_discharge_port: '',
    bkg_discharge_port_name: '',
    bkg_intended_vessel: '',
    bkg_voyage: '',
    bkg_etd: appStore?.utils?.formatDate(new Date()) ?? '',
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
  }
}

export function mapBookingListRow(item, index) {
  return {
    ...item,
    index,
    booking_status: item.booking_status ?? item.bkg_shipment_status ?? null,
    shipper_name: item.shipper_name ?? item.shipper?.add_address_name ?? null,
    consignee_name: item.consignee_name ?? item.consignee?.add_address_name ?? null,
  }
}

export function mapBookingDetailToForm(data, appStore) {
  const defaults = createDefaultBookingForm(appStore)
  if (!data) {
    return defaults
  }

  const notifyParty = data.notify_party || { add_address_name: 'SAME AS CONSIGNEE' }

  return {
    ...defaults,
    ...data,
    freight_status: data.freight_status ?? defaults.freight_status,
    bkg_insurance_value_currency:
      data.bkg_insurance_value_currency ?? data.bkg_insurance_currency ?? defaults.bkg_insurance_value_currency,
    shipper: { ...emptyParty(), ...data.shipper },
    consignee: { ...emptyParty(), ...data.consignee },
    notify_party: notifyParty,
    notify_party_same_as_consignee: data.notify_party_same_as_consignee ?? defaults.notify_party_same_as_consignee,
    pickup: { ...emptyParty(), ...data.pickup },
    pac_list: Array.isArray(data.pac_list)
      ? data.pac_list.map((row, i) => ({ ...row, id: row.id ?? i + 1 }))
      : [],
    job: data.job || { job_status: data.job_status || defaults.job.job_status },
    doc_data: data.doc_data && typeof data.doc_data === 'object' ? data.doc_data : {},
  }
}

export function mapFormToSavePayload(form, options = {}) {
  const { isCopyAsNew = false } = options
  const payload = {
    id: form.id ?? 0,
    pk: String(form.pk ?? '').trim(),
  }

  if (isCopyAsNew) {
    payload.id = 0
    payload.pk = ''
  }

  for (const key of BOOKING_SAVE_BKG_KEYS) {
    if (Object.prototype.hasOwnProperty.call(form, key)) {
      payload[key] = form[key]
    }
  }

  payload.bkg_insurance_currency =
    form.bkg_insurance_currency ?? form.bkg_insurance_value_currency ?? null

  return payload
}

export function buildBookingListFilters(inputSearchData) {
  const filters = [
    {
      key: inputSearchData.field1.key,
      op: 'between',
      val: '',
      start: inputSearchData.field1.start,
      end: inputSearchData.field1.end,
    },
  ]

  const keyword = String(inputSearchData.field2?.val ?? '').trim()
  if (keyword) {
    filters.push({
      key: inputSearchData.field2.key,
      op: '=',
      val: keyword,
    })
  }

  Object.keys(inputSearchData).forEach(key => {
    const field = inputSearchData[key]
    if (field?.more) {
      filters.push({ key: field.key, op: field.op, val: field.val })
    }
  })

  return filters
}

export function buildBookingStatusFilters(statuses, totalCount = 0) {
  if (!Array.isArray(statuses) || statuses.length === 0) {
    return []
  }
  // 全选时不传 status 条件，等价于不过滤
  if (totalCount > 0 && statuses.length >= totalCount) {
    return []
  }
  return [{ key: 'bkg_shipment_status', op: 'In', val: statuses.join(',') }]
}
