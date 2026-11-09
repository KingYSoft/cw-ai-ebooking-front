import service from './index'

/** 获取 edoc 列表 */
export const edocSearch = params =>
  service({
    url: '/edoc/search',
    method: 'get',
    params,
  })

export const edocSave = params =>
  service({
    url: '/edoc/save',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

/** Warehouse Order eDoc 列表 */
export const whsEdocSearch = params =>
  service({
    url: '/edoc/whs-search',
    method: 'get',
    params,
  })

/** Warehouse Order eDoc 上传 */
export const whsEdocSave = params =>
  service({
    url: '/edoc/whs-save',
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

export const edocDownloadFiles = (params, signal) =>
  service({
    url: '/edoc/download-files',
    method: 'post',
    data: params,
    responseType: 'blob',
    signal,
  })

/** 删除 eBooking / Booking / Shipment 下同一文件的全部关联 */
export const edocDelete = id =>
  service({
    url: '/edoc/delete',
    method: 'delete',
    params: { id },
  })
