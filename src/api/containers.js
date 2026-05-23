// import service from './index'

const ok = (data = null) => Promise.resolve({ success: true, data })

export const queryContainerTypeList = () => ok({ items: [], totalCount: 0 })
