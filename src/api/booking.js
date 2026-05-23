// import service from './index'

const ok = (data = null) => Promise.resolve({ success: true, data })

export const bookingTbl = () => ok({ items: [], totalCount: 0 })

export const bookingSave = () => ok({ id: 0, pk: '' })

export const bookingOcrNewBooking = () => ok(null)

export const bookingQueryPortCode = () => ok({ list: [] })

export const userQueryAll = () => ok({ list: [] })

export const bookingConvertToShipment = () => ok(null)

export const bookingExport = () => ok(null)
