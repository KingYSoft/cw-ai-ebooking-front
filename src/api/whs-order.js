// import service from './index'
import { getMockWhsOrderFormByPk, saveMockWhsOrder } from '@/mock/whs-order'

/**
 * 分页查询仓库订单列表
 */
export const pageWhsOrder = params => {
  // return service({
  //   url: '/whs-order/page-whs-order',
  //   method: 'get',
  //   params,
  // })
  return Promise.resolve({ data: null })
}

/**
 * 根据 pk 获取仓库订单详情
 * @param {string} pkid
 */
export const whsOrderGetById = pkid => {
  // return service({
  //   url: '/whs-order/whs-order-getbyid',
  //   method: 'get',
  //   params: { pkid },
  // })
  const data = getMockWhsOrderFormByPk(pkid)
  return Promise.resolve({ success: !!data, data })
}

/**
 * 保存仓库订单（含 item_list 明细）
 */
export const whsOrderSave = data => {
  // return service({
  //   url: '/whs-order/save',
  //   method: 'post',
  //   data,
  // })
  return saveMockWhsOrder(data)
}
