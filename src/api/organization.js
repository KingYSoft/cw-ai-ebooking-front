// import service from './index'

const ok = (data = null) => Promise.resolve({ success: true, data })

export const queryOrganizationPage = () => ok({ items: [], totalCount: 0 })

export const getOrganizationById = () => ok(null)

export const organizationTbl = () => ok({ items: [], totalCount: 0 })

export const createOrUpdateOrganization = () => ok(null)

export const deleteOrganization = () => ok({})

export const organizationSaveOrgAddress = () => ok({ address: null })

export const organizationQueryOrgAddress = () => ok({ items: [] })

export const organizationQueryOrgCarrier = () => ok({ items: [] })
