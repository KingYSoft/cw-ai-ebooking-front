// import service from './index'

const ok = (data = null) => Promise.resolve({ success: true, data })

export const queryServiceLevelPage = () => ok({ items: [], totalCount: 0 })

export const saveServiceLevel = () => ok(null)

export const deleteServiceLevelById = () => ok({})

export const queryServiceLevelOptions = () => ok({ items: [] })
