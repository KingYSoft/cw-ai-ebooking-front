import service from './index'

export const queryPartyRolePage = params =>
  service({ url: '/party-role/query-page', method: 'get', params })
export const getPartyRoleById = pk =>
  service({ url: '/party-role/detail', method: 'get', params: { pk } })
export const savePartyRole = data => service({ url: '/party-role/save', method: 'post', data })
export const deletePartyRole = pk =>
  service({ url: '/party-role/delete', method: 'post', data: { pk } })
