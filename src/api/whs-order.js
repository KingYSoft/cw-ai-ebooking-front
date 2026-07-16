import service from './index'

/** POST /whs-order/query-page — 分页列表 */
export const whsOrderQueryPage = data =>
  service({
    url: '/whs-order/query-page',
    method: 'post',
    data,
  })

/** GET /whs-order/detail — 详情 */
export const whsOrderDetail = pk =>
  service({
    url: '/whs-order/detail',
    method: 'get',
    params: { pk },
  })

/** POST /whs-order/save — 保存 */
export const whsOrderSave = data =>
  service({
    url: '/whs-order/save',
    method: 'post',
    data,
  })

/** POST /whs-order/submit — 提交 */
export const whsOrderSubmit = pk =>
  service({
    url: '/whs-order/submit',
    method: 'post',
    data: { pk },
  })

/**
 * 上传 PDF/XLSX Booking 文件识别，回填新建仓库订单
 * @param {FormData} formData 字段 file
 */
export const recognizeWhsBookingFile = formData =>
  service({
    url: '/whs-order/recognize-whs-booking-file',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

/** @deprecated 使用 whsOrderQueryPage */
export const pageWhsOrder = whsOrderQueryPage

/** @deprecated 使用 whsOrderDetail */
export const whsOrderGetById = pk => whsOrderDetail(pk)
