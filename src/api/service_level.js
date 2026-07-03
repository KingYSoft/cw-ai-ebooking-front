import service from './index'

export const queryServiceLevelOptions = params =>
  service({ url: '/service-level/options', method: 'get', params })
