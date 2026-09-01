import service from './index'

/** GET /dict/query-country-list — params: `{ query?: string, is_system?: number }` */
export const queryCountryList = (params = {}, signal) =>
  service({
    url: '/dict/query-country-list',
    method: 'get',
    params,
    signal,
  })
