import service from './index'

/** GET /dashboard/booking-analysis — 首页统计 */
export const dashboardBookingAnalysis = (params = {}) =>
  service({
    url: '/dashboard/booking-analysis',
    method: 'get',
    params,
  })
