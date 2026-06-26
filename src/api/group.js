import service from './index'

export const queryGroupPage = params => service({ url: '/group/query-page', method: 'get', params })
export const getGroupById = pk => service({ url: '/group/detail', method: 'get', params: { pk } })
export const saveGroup = data => service({ url: '/group/save', method: 'post', data })
export const queryGroupAllPermission = () =>
  service({ url: '/group/all-permission', method: 'get' })
