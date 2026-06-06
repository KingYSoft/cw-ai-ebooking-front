// import service from './index'

const ok = (data = null) => Promise.resolve({ success: true, data })

export const queryOrganizationPage = () => ok({ items: [], totalCount: 0 })

export const getOrganizationById = () => ok(null)

export const organizationTbl = () => ok({ items: [], totalCount: 0 })

export const createOrUpdateOrganization = () => ok(null)

export const deleteOrganization = () => ok({})

/** TODO: 接入真实 organizationSaveOrgAddress API */
export const organizationSaveOrgAddress = formData =>
  ok({
    address: {
      ...formData,
      code: formData.code || `NEW${Date.now()}`,
      pk: formData.pk || `addr-new-${Date.now()}`,
      company_name: formData.company_name,
    },
  })

export const organizationQueryOrgAddress = () => ok({ items: [] })

export const organizationQueryOrgCarrier = () => ok({ items: [] })
