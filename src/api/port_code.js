import service from './index'

export const portCodeQueryOptions = (params, signal) =>
  service({
    url: '/port-code/query-options',
    method: 'get',
    params,
    signal,
  })
