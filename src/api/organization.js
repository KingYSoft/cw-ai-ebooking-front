import service from './index'

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

/**
 * GET /api/organization/query-org-address
 * @param {object} params query, address_type, skipCount, maxResultCount
 */
export const organizationQueryOrgAddress = (params = {}, signal) => {
  const {
    query,
    address_type,
    skipCount,
    maxResultCount,
    Sorting,
    SkipCount,
    MaxResultCount,
    ...rest
  } = params

  return service({
    url: '/api/organization/query-org-address',
    method: 'get',
    params: {
      query,
      address_type,
      Sorting,
      SkipCount: SkipCount ?? skipCount ?? 0,
      MaxResultCount: MaxResultCount ?? maxResultCount ?? 50,
      ...rest,
    },
    signal,
  })
}

export const organizationQueryOrgCarrier = () => ok({ items: [] })
