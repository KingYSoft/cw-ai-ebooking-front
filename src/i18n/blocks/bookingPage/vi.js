import edit from './editVi'

export default {
  form: {
    shipper_name: {
      err: 'Shipper Name không được để trống.',
    },
    consignee_name: {
      err: 'Consignee Name không được để trống.',
    },
    bkg_transport_mode: {
      err: 'Transport Mode không được để trống.',
    },
    bkg_origin: {
      err: 'Origin không được để trống.',
    },
    bkg_destination: {
      err: 'Destination không được để trống.',
    },
    bkg_load_port: {
      err: 'Load không được để trống.',
    },
    bkg_discharge_port: {
      err: 'POD (Discharge) không được để trống.',
    },
    bkg_intended_vessel: {
      err: 'Vessel không được để trống.',
    },
    bkg_voyage: {
      err: 'Voyage không được để trống.',
    },
    bkg_etd: {
      err: 'ETD không được để trống.',
    },
    bkg_eta: {
      err: 'ETA không được để trống.',
    },
    bkg_cargo_ready: {
      err: 'Cargo Ready Date không được để trống.',
    },
    etd_must_be_before_cargo_ready: {
      err: 'ETD phải muộn hơn Cargo Ready Date.',
    },
    eta_vs_etd_sea: {
      err: 'Với đường biển (SEA), ETA phải muộn hơn ETD (không được cùng ngày).',
    },
    eta_vs_etd_air: {
      err: 'Với đường hàng không (AIR), ETA không được sớm hơn ETD.',
    },
    bkg_packing_mode: {
      err: 'Container không được để trống.',
    },
    bkg_inco: {
      err: 'Inco Term không được để trống.',
    },
    bkg_service_level: {
      err: 'Service Level không được để trống.',
    },
    bkg_actual_volume: {
      err: 'CBM phải lớn hơn 0.',
    },
    bkg_actual_weight: {
      err: 'Gross Weight phải lớn hơn 0.',
    },
    bkg_actual_chargeable: {
      err: 'Chargeable Weight phải lớn hơn 0.',
    },
    bkg_volume_weight: {
      err: 'Volume Weight phải lớn hơn 0.',
    },
    bkg_total_package_count: {
      err: 'No. of Package phải lớn hơn 0.',
    },
    bkg_transit_time: {
      err: 'Transit Time phải lớn hơn 0.',
    },
    bkg_goods_value: {
      err: 'Cargo Value phải lớn hơn 0.',
    },
    bkg_goods_value_currency: {
      err: 'Cargo Value Currency không được để trống.',
    },
    bkg_insurance_value: {
      err: 'Ins. Value phải lớn hơn 0.',
    },
    bkg_insurance_currency: {
      err: 'Ins. Value Currency không được để trống.',
    },
    bkg_freight_terms: {
      err: 'Freight Terms không được để trống.',
    },
    bkg_release_type: {
      err: 'Release Type không được để trống.',
    },
    bkg_commodity: {
      err: 'Commodity không được để trống.',
    },
    bkg_goods_description: {
      err: 'Good Desc. không được để trống.',
    },
    bkg_marks_nos: {
      err: 'Marks & No. không được để trống.',
    },
    pac_container_type: {
      err: 'Container Type không được để trống.',
    },
    pac_list: {
      err: 'Container phải có ít nhất một dòng.',
    },
    pac_container_count: {
      err: 'Container Count phải lớn hơn 0.',
    },
    pac_package_count: {
      err: 'Pieces phải lớn hơn 0.',
    },
    pac_pack_type: {
      err: 'Pack Type không được để trống.',
    },
    pac_gross_weight: {
      err: 'Gross Wt phải lớn hơn 0.',
    },
    pac_actual_volume: {
      err: 'Volume phải lớn hơn 0.',
    },
    wso_transport_mode: {
      err: 'Transport Mode không được để trống.',
    },
    wso_packing_mode: {
      err: 'Container không được để trống.',
    },
    wso_load_port: {
      err: 'Load không được để trống.',
    },
    wso_etd: {
      err: 'ETD không được để trống.',
    },
    wso_cargo_ready: {
      err: 'Cargo Ready Date không được để trống.',
    },
    wso_actual_weight: {
      err: 'Gross Weight phải lớn hơn 0.',
    },
    wso_actual_volume: {
      err: 'CBM phải lớn hơn 0.',
    },
    wso_volume_weight: {
      err: 'Volume Weight phải lớn hơn 0.',
    },
    wso_actual_chargeable: {
      err: 'Chargeable Weight phải lớn hơn 0.',
    },
    wso_total_package_count: {
      err: 'No. of Package phải lớn hơn 0.',
    },
    wso_inco: {
      err: 'Inco Term không được để trống.',
    },
    wso_transit_time: {
      err: 'Transit Time phải lớn hơn 0.',
    },
    wso_goods_value: {
      err: 'Cargo Value phải lớn hơn 0.',
    },
    wso_insurance_value: {
      err: 'Ins. Value phải lớn hơn 0.',
    },
    wso_freight_terms: {
      err: 'Freight Terms không được để trống.',
    },
    wso_release_type: {
      err: 'Release Type không được để trống.',
    },
    wso_commodity: {
      err: 'Commodity không được để trống.',
    },
    wso_goods_description: {
      err: 'Good Desc. không được để trống.',
    },
    wso_marks_nos: {
      err: 'Marks & No. không được để trống.',
    },
  },
  edit,
  list: {
    pageTitle: 'Chi tiết đặt chỗ',
    new: 'Mới',
    status: 'Trạng thái:',
    startDate: 'Từ ngày',
    endDate: 'Đến ngày',
    jobNumber: 'Số công việc',
    tableHeaders: {
      bookingNo: 'Số đặt chỗ',
      status: 'Trạng thái',
      transMode: 'Phương thức vận chuyển',
      containerMode: 'Loại container',
      houseBill: 'Vận đơn phụ',
      shipperName: 'Tên người gửi',
      consigneeName: 'Tên người nhận',
      origin: 'Điểm đi',
      destination: 'Điểm đến',
      crd: 'CRD',
      etd: 'ETD',
      eta: 'ETA',
      grossWeight: 'Trọng lượng tổng',
      cbm: 'CBM',
      freightTerm: 'Điều khoản cước',
      inco: 'Inco',
    },
    menu: {
      copy: 'Sao chép',
      deactivate: 'Vô hiệu hóa',
    },
    listStatus: {
      saved: 'Saved',
      waiting_approve: 'Waiting for Approve',
      pending_si: 'Pending for Submit SI',
      deactive: 'Deactive',
    },
  },
}
