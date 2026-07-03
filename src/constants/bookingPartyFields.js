export const BOOKING_PARTY_BLOCKS = [
  { key: 'shipper', addressType: 'SHIPPER', required: true },
  { key: 'consignee', addressType: 'CONSIGNEE', required: true },
  { key: 'notify_party', addressType: 'NOTIFY_PARTY', required: false, sameAsConsignee: true },
  { key: 'pickup', addressType: 'PICKUP', required: false },
]

export const BOOKING_CUT_OFF_FIELDS = [
  { label: 'FCL', key: 'bkg_fcl_cut_off_date' },
  { label: 'OOG', key: 'bkg_oog_cut_off_date' },
  { label: 'Reefer', key: 'bkg_reefer_cut_off_date' },
  { label: 'DG', key: 'bkg_dg_cut_off_date' },
  { label: 'VGM', key: 'bkg_vgm_cut_off_date' },
  { label: 'Document closure', key: 'bkg_doc_cut_off_date' },
]
