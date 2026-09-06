// import type { LocationQueryValue } from 'vue-router'

export const resolveLoginRedirect = redirect => {
  const target = Array.isArray(redirect) ? redirect[0] : redirect

  if (!target || typeof target !== 'string') {
    return null
  }

  if (!target.startsWith('/') || target.startsWith('//')) {
    return null
  }

  return target
}
