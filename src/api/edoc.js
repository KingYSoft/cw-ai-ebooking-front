// import service from './index'

const ok = (data = null) => Promise.resolve({ success: true, data })

export const edocSearch = () => ok({ items: [] })

export const edocSave = () => ok(null)

export const edocDownloadFiles = () => ok(null)
