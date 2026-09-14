import service from './index'

export const queryPartyGroupPage = data =>
  service({ url: '/party-group/query-page', method: 'post', data })
export const getPartyGroup = pk =>
  service({ url: '/party-group/detail', method: 'get', params: { pk } })
export const queryPartyGroupOptions = (params, signal) =>
  service({ url: '/party-group/query-options', method: 'get', params, signal })
export const savePartyGroup = data => service({ url: '/party-group/save', method: 'post', data })
