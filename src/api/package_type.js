// import service from './index'

const ok = (data = null) => Promise.resolve({ success: true, data })

export const queryPackageTypeList = () => ok({ items: [], totalCount: 0 })
