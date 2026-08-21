import service from './index'

/** Warehouse 分页列表（当前登录用户部门关联） */
export const pageWhsWarehouse = data => {
  return service({
    url: '/whs-warehouse/page',
    method: 'post',
    data,
  })
}

/** 根据 pk 查询 Warehouse 详情 */
export const getWhsWarehouse = pk => {
  return service({
    url: '/whs-warehouse',
    method: 'get',
    params: { pk },
  })
}

/** 删除 Warehouse（部门关联） */
export const deleteWhsWarehouse = pk => {
  return service({
    url: '/whs-warehouse',
    method: 'delete',
    params: { pk },
  })
}

/** Warehouse 新增/修改 */
export const saveWhsWarehouse = data => {
  return service({
    url: '/whs-warehouse/save',
    method: 'post',
    data,
  })
}

/** Warehouse 下拉列表（当前登录用户部门关联） */
export const selectWhsWarehouse = (data = {}) => {
  return service({
    url: '/whs-warehouse/select',
    method: 'post',
    data,
  })
}
