import edit from './editZhHant'

export default {
  form: {
    shipper_name: {
      err: 'Shipper Name 不能為空。',
    },
    consignee_name: {
      err: 'Consignee Name 不能為空。',
    },
    bkg_transport_mode: {
      err: 'Transport Mode 不能為空。',
    },
    bkg_origin: {
      err: 'Origin 不能為空。',
    },
    bkg_destination: {
      err: 'Destination 不能為空。',
    },
    bkg_load_port: {
      err: 'Load 不能為空。',
    },
    bkg_discharge_port: {
      err: 'POD (Discharge) 不能為空。',
    },
    bkg_intended_vessel: {
      err: 'Vessel 不能為空。',
    },
    bkg_voyage: {
      err: 'Voyage 不能為空。',
    },
    bkg_etd: {
      err: 'ETD 不能為空。',
    },
    bkg_eta: {
      err: 'ETA 不能為空。',
    },
    bkg_cargo_ready: {
      err: 'Cargo Ready Date 不能為空。',
    },
    etd_must_be_before_cargo_ready: {
      err: 'ETD 必須晚於 Cargo Ready Date。',
    },
    eta_vs_etd_sea: {
      err: '海運 (SEA) 下，ETA 須晚於 ETD（不可同日）。',
    },
    eta_vs_etd_air: {
      err: '空運 (AIR) 下，ETA 不可早於 ETD。',
    },
    bkg_packing_mode: {
      err: 'Container 不能為空。',
    },
    bkg_inco: {
      err: 'Inco Term 不能為空。',
    },
    bkg_service_level: {
      err: 'Service Level 不能為空。',
    },
    bkg_actual_volume: {
      err: 'CBM 必須大於 0。',
    },
    bkg_actual_weight: {
      err: 'Gross Weight 必須大於 0。',
    },
    bkg_actual_chargeable: {
      err: 'Chargeable Weight 必須大於 0。',
    },
    bkg_volume_weight: {
      err: 'Volume Weight 必須大於 0。',
    },
    bkg_total_package_count: {
      err: 'No. of Package 必須大於 0。',
    },
    bkg_transit_time: {
      err: 'Transit Time 必須大於 0。',
    },
    bkg_goods_value: {
      err: 'Cargo Value 必須大於 0。',
    },
    bkg_goods_value_currency: {
      err: 'Cargo Value Currency 不能為空。',
    },
    bkg_insurance_value: {
      err: 'Ins. Value 必須大於 0。',
    },
    bkg_insurance_currency: {
      err: 'Ins. Value Currency 不能為空。',
    },
    bkg_freight_terms: {
      err: 'Freight Terms 不能為空。',
    },
    bkg_release_type: {
      err: 'Release Type 不能為空。',
    },
    bkg_commodity: {
      err: 'Commodity 不能為空。',
    },
    bkg_goods_description: {
      err: 'Good Desc. 不能為空。',
    },
    bkg_marks_nos: {
      err: 'Marks & No. 不能為空。',
    },
    pac_container_type: {
      err: 'Container Type 不能為空。',
    },
    pac_list: {
      err: 'Container 必須至少有一筆資料。',
    },
    pac_container_count: {
      err: 'Container Count 必須大於 0。',
    },
    pac_package_count: {
      err: 'Pieces 必須大於 0。',
    },
    pac_pack_type: {
      err: 'Pack Type 不能為空。',
    },
    pac_gross_weight: {
      err: 'Gross Wt 必須大於 0。',
    },
    pac_actual_volume: {
      err: 'Volume 必須大於 0。',
    },
    wso_transport_mode: {
      err: 'Transport Mode 不能為空。',
    },
    wso_packing_mode: {
      err: 'Container 不能為空。',
    },
    wso_load_port: {
      err: 'Load 不能為空。',
    },
    wso_etd: {
      err: 'ETD 不能為空。',
    },
    wso_cargo_ready: {
      err: 'Cargo Ready Date 不能為空。',
    },
    wso_actual_weight: {
      err: 'Gross Weight 必須大於 0。',
    },
    wso_actual_volume: {
      err: 'CBM 必須大於 0。',
    },
    wso_volume_weight: {
      err: 'Volume Weight 必須大於 0。',
    },
    wso_actual_chargeable: {
      err: 'Chargeable Weight 必須大於 0。',
    },
    wso_total_package_count: {
      err: 'No. of Package 必須大於 0。',
    },
    wso_inco: {
      err: 'Inco Term 不能為空。',
    },
    wso_transit_time: {
      err: 'Transit Time 必須大於 0。',
    },
    wso_goods_value: {
      err: 'Cargo Value 必須大於 0。',
    },
    wso_insurance_value: {
      err: 'Ins. Value 必須大於 0。',
    },
    wso_freight_terms: {
      err: 'Freight Terms 不能為空。',
    },
    wso_release_type: {
      err: 'Release Type 不能為空。',
    },
    wso_commodity: {
      err: 'Commodity 不能為空。',
    },
    wso_goods_description: {
      err: 'Good Desc. 不能為空。',
    },
    wso_marks_nos: {
      err: 'Marks & No. 不能為空。',
    },
  },
  edit,
  list: {
    pageTitle: '訂艙明細',
    new: '新建',
    status: '狀態：',
    startDate: '開始日期',
    endDate: '結束日期',
    jobNumber: '工作號',
    tableHeaders: {
      bookingNo: '訂艙號',
      status: '狀態',
      transMode: '運輸方式',
      containerMode: '裝箱方式',
      houseBill: '分單號',
      shipperName: '發貨人名稱',
      consigneeName: '收貨人名稱',
      origin: '起運地',
      destination: '目的地',
      crd: 'CRD',
      etd: 'ETD',
      eta: 'ETA',
      grossWeight: '毛重',
      cbm: 'CBM',
      freightTerm: '運費條款',
      inco: 'Inco',
    },
    menu: {
      copy: '複製',
      deactivate: '停用',
    },
    listStatus: {
      submitted: '已提交',
      under_review: '審核中',
      confirmed: '已確認',
      cancelled: '已取消',
      rejected: '已拒絕',
    },
  },
}
