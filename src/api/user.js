import service from './index'

export const queryUserPage = params => service({ url: '/user/query-page', method: 'get', params })
export const saveUser = data => service({ url: '/user/save', method: 'post', data })
export const deleteUserById = id => service({ url: `/user/delete/${id}`, method: 'post' })
export const getUserById = (id, pk) =>
  service({ url: '/user/detail', method: 'get', params: { id, pk } })

/**
 * 获取用户收藏菜单列表
 * @returns 收藏菜单数据
 */
export const getUserFavMenu = () => {
  return service({
    url: '/GetUserFavMenu',
    method: 'get',
  })
}

/**
 * 保存用户收藏菜单
 * @param code 菜单代码
 * @returns
 */
export const saveUserMenu = code => {
  return service({
    url: `/SaveUserMenu/${code}`,
    method: 'post',
  })
}

/**
 * 删除用户收藏菜单
 * @param code 菜单代码
 * @returns
 */
export const deleteUserMenu = code => {
  return service({
    url: `/DeleteUserMenu/${code}`,
    method: 'post',
  })
}
export const userQuerySwitchTbl = params => {
  return service({
    url: '/user/query-switch-tbl',
    method: 'get',
    params,
  })
}

export const userSwitchBranch = data =>
  service({ url: '/user/switch-branch', method: 'post', data })

export const userChangePassword = data =>
  service({ url: '/user/change-password', method: 'post', data })

export const userChangeSetting = data =>
  service({ url: '/user/change-setting', method: 'post', data })

/** 公司/用户本位币与默认发票币种等（响应 body.data 为币种代码） */
export const getUserHomeCurrency = () =>
  service({ url: '/user/home-currency', method: 'get' })
