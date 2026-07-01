import { whsOrderSave } from '@/api/whs-order'

const WSO_TO_BKG_FIELDS = [
  ['wso_transport_mode', 'bkg_transport_mode'],
  // UI「Container」→ 接口 wso_shipment_type（与 Booking 的 bkg_packing_mode 同源）
  ['wso_shipment_type', 'bkg_packing_mode'],
  ['wso_consign_no', 'bkg_consign_no'],
  ['wso_house_bill', 'bkg_house_bill'],
  ['wso_booking_reference', 'bkg_booking_reference'],
  ['wso_goods_description', 'bkg_goods_description'],
  ['wso_marks_nos', 'bkg_marks_nos'],
  ['wso_goods_value', 'bkg_goods_value'],
  ['wso_goods_value_currency', 'bkg_goods_value_currency'],
  ['wso_insurance_value', 'bkg_insurance_value'],
  ['wso_insurance_currency', 'bkg_insurance_currency'],
  ['wso_release_type', 'bkg_release_type'],
  ['wso_booking_party', 'bkg_booking_party'],
  ['wso_etd', 'bkg_etd'],
  ['wso_eta', 'bkg_eta'],
  ['wso_cargo_ready', 'bkg_cargo_ready'],
  ['wso_est_pickup', 'bkg_est_pickup'],
  ['wso_est_delivery', 'bkg_est_delivery'],
  ['wso_client_requested_eta', 'bkg_client_requested_eta'],
  ['wso_freight_terms', 'bkg_freight_terms'],
  ['wso_service_level', 'bkg_service_level'],
  ['wso_inco', 'bkg_inco'],
  ['wso_additional_terms', 'bkg_additional_terms'],
  ['wso_actual_volume', 'bkg_actual_volume'],
  ['wso_unit_of_volume', 'bkg_unit_of_volume'],
  ['wso_actual_weight', 'bkg_actual_weight'],
  ['wso_unit_of_weight', 'bkg_unit_of_weight'],
  ['wso_actual_chargeable', 'bkg_actual_chargeable'],
  ['wso_actual_chargeable_unit', 'bkg_actual_chargeable_unit'],
  ['wso_volume_weight', 'bkg_volume_weight'],
  ['wso_volume_weight_unit', 'bkg_volume_weight_unit'],
  ['wso_volume_factor', 'bkg_volume_factor'],
  ['wso_total_package_count', 'bkg_total_package_count'],
  ['wso_outer_packs', 'bkg_outer_packs'],
  ['wso_pack_type', 'bkg_pack_type'],
  ['wso_pack_type_desc', 'bkg_pack_type_desc'],
  ['wso_delivery_mode', 'bkg_delivery_mode'],
  ['wso_warehouse_location', 'bkg_warehouse_location'],
  ['wso_origin', 'bkg_origin'],
  ['wso_origin_name', 'bkg_origin_name'],
  ['wso_destination', 'bkg_destination'],
  ['wso_destination_name', 'bkg_destination_name'],
  ['wso_place_of_receipt', 'bkg_place_of_receipt'],
  ['wso_place_of_receipt_name', 'bkg_place_of_receipt_name'],
  ['wso_place_of_delivery', 'bkg_place_of_delivery'],
  ['wso_place_of_delivery_name', 'bkg_place_of_delivery_name'],
  ['wso_load_port', 'bkg_load_port'],
  ['wso_load_port_name', 'bkg_load_port_name'],
  ['wso_discharge_port', 'bkg_discharge_port'],
  ['wso_discharge_port_name', 'bkg_discharge_port_name'],
  ['wso_supplier_booking', 'bkg_supplier_booking'],
  ['wso_commodity', 'bkg_commodity'],
  ['wso_delivery_due_date', 'bkg_delivery_due_date'],
  ['wso_doc_cut_off_date', 'bkg_doc_cut_off_date'],
  ['wso_port_cargo_cut_off_date', 'bkg_port_cargo_cut_off_date'],
  ['wso_so_confirm_date', 'bkg_so_confirm_date'],
  ['wso_vgm_cut_off_date', 'bkg_vgm_cut_off_date'],
  ['wso_so_number', 'bkg_so_number'],
  ['wso_po_number', 'bkg_po_number'],
]

/** Item Detail 表格 UI 字段 ↔ 接口 woi_* */
const WOI_UI_FIELD_PAIRS = [
  ['woi_market', 'market'],
  ['woi_plant_id', 'plant_id'],
  ['woi_packlist_no', 'packing_list_no'],
  ['woi_desc', 'description'],
  ['woi_item', 'item_code'],
  ['woi_gross_wt', 'gross_weight'],
  ['woi_gw_unit', 'pac_weight_unit'],
  ['woi_net_wt', 'net_weight'],
  ['woi_nw_unit', 'pac_weight_unit'],
  ['woi_volume', 'volume'],
  ['woi_vol_unit', 'pac_actual_volume_uom'],
  ['woi_outer_pack', 'package_count'],
  ['woi_outpack_unit', 'pac_pack_type'],
  ['woi_pieces', 'pieces'],
  ['woi_is_palletization', 'is_palletization'],
  ['woi_is_battery_included', 'is_battery'],
]

function resolveItemField(row, woiKey, uiKey) {
  // 表格行以 UI 字段为准（含清空为 ''）；仅无 UI 字段时回退 woi_*
  if (Object.prototype.hasOwnProperty.call(row, uiKey)) {
    return row[uiKey]
  }
  if (hasFieldValue(row[woiKey])) {
    return row[woiKey]
  }
  return undefined
}

function mapPacListItem(row, index = 0) {
  if (!row || typeof row !== 'object') {
    return row
  }
  const lineId = normalizeSaveId(row.id, row.pk)
  const mapped = {
    ...row,
    id: lineId,
    pk: lineId > 0 ? String(row.pk ?? '').trim() : '',
    rowKey: row.rowKey ?? row.pk ?? (lineId > 0 ? `line-${lineId}` : `line-new-${index}`),
    market: resolveItemField(row, 'woi_market', 'market') ?? '',
    plant_id: resolveItemField(row, 'woi_plant_id', 'plant_id') ?? '',
    packing_list_no: resolveItemField(row, 'woi_packlist_no', 'packing_list_no') ?? '',
    description: resolveItemField(row, 'woi_desc', 'description') ?? '',
    item_code: resolveItemField(row, 'woi_item', 'item_code') ?? '',
    gross_weight: toNum(resolveItemField(row, 'woi_gross_wt', 'gross_weight')),
    net_weight: toNum(resolveItemField(row, 'woi_net_wt', 'net_weight')),
    volume: toNum(resolveItemField(row, 'woi_volume', 'volume')),
    package_count: toNum(resolveItemField(row, 'woi_outer_pack', 'package_count')),
    pieces: toNum(resolveItemField(row, 'woi_pieces', 'pieces')),
    is_palletization: toNum(resolveItemField(row, 'woi_is_palletization', 'is_palletization')),
    is_battery: toNum(resolveItemField(row, 'woi_is_battery_included', 'is_battery')),
    pac_weight_unit: resolveItemField(row, 'woi_gw_unit', 'pac_weight_unit') ?? 'KG',
    pac_actual_volume_uom: resolveItemField(row, 'woi_vol_unit', 'pac_actual_volume_uom') ?? 'CBM',
    pac_pack_type: resolveItemField(row, 'woi_outpack_unit', 'pac_pack_type') ?? '',
  }

  for (const [woiKey, uiKey] of WOI_UI_FIELD_PAIRS) {
    const val = mapped[uiKey]
    if (hasFieldValue(val)) {
      mapped[woiKey] = val
    }
  }

  return mapped
}

/** API 详情 wso_* → 表单沿用的 bkg_* 字段 */
export function mapWhsOrderDetailToForm(el) {
  if (!el || typeof el !== 'object') {
    return null
  }

  const mapped = { ...el }
  for (const [wsoKey, bkgKey] of WSO_TO_BKG_FIELDS) {
    const val = el[wsoKey] ?? el[bkgKey]
    if (hasFieldValue(val)) {
      mapped[bkgKey] = val
      mapped[wsoKey] = val
    }
  }

  // 兼容旧字段 wso_packing_mode
  if (!hasFieldValue(mapped.bkg_packing_mode) && hasFieldValue(el.wso_packing_mode)) {
    mapped.bkg_packing_mode = el.wso_packing_mode
    mapped.wso_shipment_type = el.wso_packing_mode
  }

  const rawItems = el.item_list ?? el.pac_list ?? []
  mapped.pac_list = Array.isArray(rawItems) ? rawItems.map((row, index) => mapPacListItem(row, index)) : []
  mapped.inbound_list = Array.isArray(el.inbound_list) ? el.inbound_list : []
  mapped.outbound_list = Array.isArray(el.outbound_list) ? el.outbound_list : []
  mapped.eDocs_list = el.eDocs_list ?? []
  mapped.shipper = { ...el.shipper }
  mapped.consignee = { ...el.consignee }
  mapped.notify_party = {
    ...(el.notify_party ?? { add_address_name: 'SAME AS CONSIGNEE' }),
  }
  mapped.pickup = { ...el.pickup }
  mapped.delivery = { ...el.delivery }
  mapped.job = el.job ?? {}
  mapped.notify_party_same_as_consignee = resolveNotifyPartySameAsConsignee(
    el.notify_party_same_as_consignee,
    mapped.notify_party,
  )

  // Volume Weight 单位 = Gross Weight；Chargeable Weight 单位 = CBM
  mapped.bkg_volume_weight_unit =
    mapped.bkg_unit_of_weight ?? mapped.bkg_volume_weight_unit ?? 'KG'
  mapped.bkg_actual_chargeable_unit =
    mapped.bkg_unit_of_volume ?? mapped.bkg_actual_chargeable_unit ?? 'M3'
  mapped.wso_volume_weight_unit = mapped.bkg_volume_weight_unit
  mapped.wso_actual_chargeable_unit = mapped.bkg_actual_chargeable_unit

  return mapped
}

const ADDRESS_PARTY_KEYS = ['shipper', 'consignee', 'notify_party']

function cloneAddressParty(addr) {
  if (!addr || typeof addr !== 'object') {
    return {}
  }
  return { ...addr }
}

function resolveNotifyPartySameAsConsignee(explicit, notifyParty) {
  if (explicit === 'Y' || explicit === 'N') {
    return explicit
  }
  return notifyParty?.add_address_name === 'SAME AS CONSIGNEE' ? 'Y' : 'N'
}

const WSO_PASSTHROUGH_KEYS = [
  'wso_is_cancelled',
  'wso_shipment_status',
  'wso_cargo_receipt',
  'wso_is_split',
  'wso_org_header_pk',
  'wso_status',
  'create_user',
  'last_modify_user',
]

function toNum(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

/** 含 0 的有效值；排除 null / undefined / 空字符串 */
function hasFieldValue(val) {
  if (val === null || val === undefined) {
    return false
  }
  if (typeof val === 'string') {
    return val !== ''
  }
  return true
}

function resolveWsoFieldValue(form, wsoKey, bkgKey) {
  if (hasFieldValue(form[bkgKey])) {
    return form[bkgKey]
  }
  if (hasFieldValue(form[wsoKey])) {
    return form[wsoKey]
  }
  return undefined
}

/** 新增行 id 为 0；前端临时 id（Date.now）也按新增处理 */
function normalizeSaveId(id, pk = '') {
  if (id == null || id === '') {
    return 0
  }
  const n = Number(id)
  if (!Number.isFinite(n) || n <= 0) {
    return 0
  }
  const pkStr = String(pk ?? '').trim()
  if (!pkStr && n > 1_000_000_000) {
    return 0
  }
  return Math.floor(n)
}

function mapFormItemToWoi(row, parentPk = '') {
  if (!row || typeof row !== 'object') {
    return null
  }
  const lineId = normalizeSaveId(row.id, row.pk)
  const linePk = lineId > 0 ? String(row.pk ?? '').trim() : ''
  return {
    id: lineId,
    pk: linePk,
    woi_parent_id: row.woi_parent_id || parentPk || '',
    woi_parent_table: row.woi_parent_table || 'whs_order',
    woi_buyer: row.woi_buyer ?? '',
    woi_seller: row.woi_seller ?? '',
    woi_po_number: row.woi_po_number ?? '',
    woi_item: resolveItemField(row, 'woi_item', 'item_code') ?? '',
    woi_desc: resolveItemField(row, 'woi_desc', 'description') ?? '',
    woi_market: resolveItemField(row, 'woi_market', 'market') ?? '',
    woi_plant_id: resolveItemField(row, 'woi_plant_id', 'plant_id') ?? '',
    woi_packlist_no: resolveItemField(row, 'woi_packlist_no', 'packing_list_no') ?? '',
    woi_gross_wt: toNum(resolveItemField(row, 'woi_gross_wt', 'gross_weight')),
    woi_gw_unit: resolveItemField(row, 'woi_gw_unit', 'pac_weight_unit') ?? 'KG',
    woi_net_wt: toNum(resolveItemField(row, 'woi_net_wt', 'net_weight')),
    woi_nw_unit: resolveItemField(row, 'woi_nw_unit', 'pac_weight_unit') ?? 'KG',
    woi_volume: toNum(resolveItemField(row, 'woi_volume', 'volume')),
    woi_vol_unit: resolveItemField(row, 'woi_vol_unit', 'pac_actual_volume_uom') ?? 'CBM',
    woi_outer_pack: toNum(resolveItemField(row, 'woi_outer_pack', 'package_count')),
    woi_inner_pack: toNum(row.woi_inner_pack),
    woi_outpack_unit: resolveItemField(row, 'woi_outpack_unit', 'pac_pack_type') ?? '',
    woi_innerpack_unit: row.woi_innerpack_unit ?? '',
    woi_pieces: toNum(resolveItemField(row, 'woi_pieces', 'pieces')),
    woi_is_palletization: toNum(resolveItemField(row, 'woi_is_palletization', 'is_palletization')),
    woi_is_battery_included: toNum(resolveItemField(row, 'woi_is_battery_included', 'is_battery')),
    woi_is_dg: toNum(row.woi_is_dg),
    woi_dg_type: row.woi_dg_type ?? '',
    woi_dg_desc: row.woi_dg_desc ?? '',
    create_user: row.create_user ?? '',
  }
}

/** 表单 bkg_* / pac_list → 保存接口 wso_* / item_list */
export function mapWhsOrderFormToSave(form, options = {}) {
  if (!form || typeof form !== 'object') {
    return { id: 0, pk: '', item_list: [] }
  }

  const payload = {
    id: normalizeSaveId(form.id, form.pk),
    pk: String(form.pk ?? '').trim(),
    item_list: [],
  }

  if (options.isCopyAsNew) {
    payload.id = 0
    payload.pk = ''
  }

  // 先带回详情里已有、但表单未单独绑 bkg_* 的 wso 字段
  for (const key of Object.keys(form)) {
    if (!key.startsWith('wso_')) {
      continue
    }
    if (hasFieldValue(form[key])) {
      payload[key] = form[key]
    }
  }

  // UI 绑定的是 bkg_*，必须用表单当前值覆盖 wso_*（此前优先 wso 导致修改不生效）
  for (const [wsoKey, bkgKey] of WSO_TO_BKG_FIELDS) {
    const val = resolveWsoFieldValue(form, wsoKey, bkgKey)
    if (hasFieldValue(val)) {
      payload[wsoKey] = val
    }
  }

  // save 接口同时存在 wso_packing_mode 时与 Container 保持一致
  if (hasFieldValue(payload.wso_shipment_type)) {
    payload.wso_packing_mode = payload.wso_shipment_type
  }

  for (const key of WSO_PASSTHROUGH_KEYS) {
    const val = form[key]
    if (hasFieldValue(val)) {
      payload[key] = val
    }
  }

  // Volume Weight 单位跟 Gross Weight；Chargeable Weight 单位跟 CBM
  if (hasFieldValue(form.bkg_unit_of_weight)) {
    payload.wso_volume_weight_unit = form.bkg_unit_of_weight
  }
  if (hasFieldValue(form.bkg_unit_of_volume)) {
    payload.wso_actual_chargeable_unit = form.bkg_unit_of_volume
  }

  if (
    !hasFieldValue(payload.wso_insurance_currency) &&
    hasFieldValue(form.bkg_insurance_value_currency)
  ) {
    payload.wso_insurance_currency = form.bkg_insurance_value_currency
  }

  const pacList = Array.isArray(form.pac_list) ? form.pac_list : []
  payload.item_list = pacList.map(row => mapFormItemToWoi(row, payload.pk)).filter(Boolean)

  // save 接口仅接受 shipper / consignee / notify_party
  for (const key of ADDRESS_PARTY_KEYS) {
    payload[key] = cloneAddressParty(form[key])
  }

  return payload
}

export function mapWhsOrderListRow(item, index) {
  return {
    ...item,
    index,
    shipper_name: item.shipper_name ?? item.shipper?.add_address_name ?? null,
    consignee_name: item.consignee_name ?? item.consignee?.add_address_name ?? null,
  }
}

export async function saveWhsOrderFromForm(form, options = {}) {
  const payload = mapWhsOrderFormToSave(form, options)
  return whsOrderSave(payload)
}
