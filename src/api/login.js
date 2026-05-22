import service from './index'

/**
 * login
 * @returns
 */
export const login = params => {
  return service({
    url: '/user/login',
    method: 'post',
    data: params,
  })
}
