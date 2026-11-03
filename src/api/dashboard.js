import service from './index'

/** GET /dashboard/booking-analysis — 首页统计 */
export const dashboardBookingAnalysis = (params = {}) =>
  service({
    url: '/dashboard/booking-analysis',
    method: 'get',
    params,
  })

/** GET /dashboard/latest-bookings — 最近 Booking，默认 10 条 */
export const dashboardLatestBookings = (params = {}) =>
  service({
    url: '/dashboard/latest-bookings',
    method: 'get',
    params,
  })

/** GET /dashboard/monthly-volume — 月度 Booking/TEU/CBM */
export const dashboardMonthlyVolume = (params = {}) =>
  service({
    url: '/dashboard/monthly-volume',
    method: 'get',
    params,
  })

/** GET /dashboard/latest-bookings/export — 导出最近 Booking */
export const downloadDashboardLatestBookings = (params = {}) =>
  service({
    url: '/dashboard/latest-bookings/export',
    method: 'get',
    params,
    responseType: 'blob',
  })
