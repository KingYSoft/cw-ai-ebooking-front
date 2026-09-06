const ACCESS_TOKEN_KEY = 'token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const ACCESS_TOKEN_EXPIRES_AT_KEY = 'token_expires_at'
const REFRESH_TOKEN_EXPIRES_AT_KEY = 'refresh_token_expires_at'

// access token 每次请求和 SignalR 连接都会从这里读取，避免使用过期缓存。
export const getAccessToken = () => sessionStorage.getItem(ACCESS_TOKEN_KEY)

// refresh token 只用于自动续期和登出撤销。
export const getRefreshToken = () => sessionStorage.getItem(REFRESH_TOKEN_KEY)

export const setAuthSession = data => {
  if (!data) {
    return
  }

  const now = Date.now()
  // 登录、切换分支、刷新 token 都复用这个方法写入最新会话。
  if (data.access_token) {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, data.access_token)
  }
  if (data.refresh_token) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token)
  }
  if (data.expires_in) {
    sessionStorage.setItem(
      ACCESS_TOKEN_EXPIRES_AT_KEY,
      String(now + Number(data.expires_in) * 1000),
    )
  }
  if (data.refresh_expires_in) {
    sessionStorage.setItem(
      REFRESH_TOKEN_EXPIRES_AT_KEY,
      String(now + Number(data.refresh_expires_in) * 1000),
    )
  }
}

export const clearAuthSession = () => {
  // 只清理认证相关 key，避免误删业务页面临时数据。
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  sessionStorage.removeItem(ACCESS_TOKEN_EXPIRES_AT_KEY)
  sessionStorage.removeItem(REFRESH_TOKEN_EXPIRES_AT_KEY)
}

export const buildAuthQuery = () => {
  // SignalR 和 beacon 走 query string，因此这里统一使用最新 access token 拼接。
  const token = getAccessToken()
  return token ? `enc_auth_token=${encodeURIComponent(token)}` : ''
}

// 刷新接口需要同时带上旧 access token 和 refresh token。
export const getAuthSessionPayload = () => ({
  access_token: getAccessToken(),
  refresh_token: getRefreshToken(),
})
