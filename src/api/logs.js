import service from './index'

// 搜索 Logs 列表
export const logsSearch = params => {
  return service({
    url: '/api/logs/search',
    method: 'post',
    data: params,
  })
}

export const queryAuditLog = params => {
  return service({
    url: '/api/logs/query-audit-log',
    method: 'post',
    data: params,
  })
}

export const queryEntityLog = params => {
  return service({
    url: '/api/logs/query-entity-log',
    method: 'get',
    params,
  })
}
