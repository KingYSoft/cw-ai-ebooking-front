import service from './index'

export const acquireEditLock = data => {
  return service({
    url: '/api/edit-lock/acquire',
    method: 'post',
    data,
  })
}

export const releaseEditLock = data => {
  return service({
    url: '/api/edit-lock/release',
    method: 'post',
    data,
  })
}
