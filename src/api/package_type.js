import service from './index'

/** Lightweight list for combobox / remote menu; params: `{ query?: string }` */
export const queryPackageTypeList = params =>
  service({ url: '/package-type/query-list', method: 'get', params })
