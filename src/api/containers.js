import service from './index'

/** List for combobox / remote menu; params: `{ query?: string }` */
export const queryContainerTypeList = params => {
  return service({
    url: '/dict/query-container-type-list',
    method: 'get',
    params,
  })
}
