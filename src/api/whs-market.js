import service from './index'

/** GET /api/whsMarket/options — Market 下拉选项 */
export const getWhsMarketOptions = (params = {}) =>
  service({
    url: '/api/whsMarket/options',
    method: 'get',
    params,
  })
