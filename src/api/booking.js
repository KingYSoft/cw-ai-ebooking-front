import service from './index'

/** POST /booking/query-page — 分页列表 */
export const bookingQueryPage = data =>
  service({
    url: '/booking/query-page',
    method: 'post',
    data,
  })

/** GET /booking/detail — 详情 */
export const bookingDetail = pk =>
  service({
    url: '/booking/detail',
    method: 'get',
    params: { pk },
  })

/** POST /booking/save — 保存 */
export const bookingSave = data =>
  service({
    url: '/booking/save',
    method: 'post',
    data,
  })

/** POST /booking/submit — 提交 */
export const bookingSubmit = data =>
  service({
    url: '/booking/submit',
    method: 'post',
    data,
  })

/** POST /booking/si-submit — 提交 SI */
export const bookingSiSubmit = data =>
  service({
    url: '/booking/si-submit',
    method: 'post',
    data,
  })

/** POST /booking/cancel — 取消 */
export const bookingCancel = data =>
  service({
    url: '/booking/cancel',
    method: 'post',
    data,
  })

// --- 以下接口暂未对接，保留 stub 供其他模块使用 ---

const ok = (data = null) => Promise.resolve({ success: true, data })

/** @deprecated 使用 bookingQueryPage */
export const bookingTbl = bookingQueryPage

export const bookingOcrNewBooking = () => ok(null)

export const bookingQueryPortCode = () => ok({ list: [] })

export const userQueryAll = () => ok({ list: [] })

export const bookingConvertToShipment = () => ok(null)

export const bookingExport = () => ok(null)
