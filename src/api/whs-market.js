import service from './index'

/** GET /api/whsMarket/options — Market 下拉选项 */
export const getWhsMarketOptions = (params = {}) =>
  service({
    url: '/api/whsMarket/options',
    method: 'get',
    params,
  })

/**
 * GET /api/whsMarket/market-plant-options
 * @param {Object} [params]
 * @param {string} [params.query] Market Group；编辑时传入以加载 plant_options / market_list / pod_list
 */
export const getWhsMarketPlantOptions = params =>
  service({
    url: '/api/whsMarket/market-plant-options',
    method: 'get',
    params,
  })
