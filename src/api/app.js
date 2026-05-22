import service from './index'

/**
 * 获取 app 系统全局配置
 * @returns 全局配置
 */
export const appAllConfig = params => {
  return service({
    url: '/app/all/config',
    method: 'get',
    params,
  })
}

/**
 * clear all cache
 * @returns
 */
export const appCacheClear = params => {
  return service({
    url: '/app/cache/clear',
    method: 'get',
    params,
  })
}
