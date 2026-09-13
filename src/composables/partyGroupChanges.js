export const PARTY_GROUP_ROLES = ['AGENT', 'CONSIGNEE', 'SHIPPER']
export const normalizeGroupPk = value => String(value ?? '').trim() || null
const comparable = value => normalizeGroupPk(value)?.toLowerCase() ?? null
export const groupLinkFields = PARTY_GROUP_ROLES.map(role => `${role.toLowerCase()}_group_pk`)
export const groupLinkKey = row => JSON.stringify(groupLinkFields.map(key => comparable(row[key])))
export const groupLinkInput = row => Object.fromEntries(groupLinkFields.map(key => [key, normalizeGroupPk(row[key])]))

/** 校验精确三元组；二元和三元记录共存，不展开或合并关系。 */
export function validateGroupLinks(rows, groupPk) {
  const seen = new Set()
  for (const row of rows) {
    const values = groupLinkFields.map(key => comparable(row[key]))
    if (values.filter(Boolean).length < 2 || !values.includes(comparable(groupPk))) {
      return 'partyRequired'
    }
    const key = groupLinkKey(row)
    if (seen.has(key)) {
      return 'duplicateRelation'
    }
    seen.add(key)
  }
  return null
}

/** 基于完整加载的基线生成差量，分页搜索仅影响展示，不能影响删除集合。 */
export function buildGroupChanges(originalMembers, members, originalLinks, links) {
  const beforeOrgs = new Set(originalMembers.map(row => comparable(row.org_header_pk ?? row.pk)))
  const afterOrgs = new Set(members.map(row => comparable(row.org_header_pk ?? row.pk)))
  const byPk = new Map(originalLinks.map(row => [comparable(row.pk), row]))
  const currentPks = new Set(links.filter(row => row.pk).map(row => comparable(row.pk)))
  return {
    added_org_header_pks: members.filter(row => !beforeOrgs.has(comparable(row.org_header_pk ?? row.pk))).map(row => row.org_header_pk ?? row.pk),
    removed_org_header_pks: originalMembers.filter(row => !afterOrgs.has(comparable(row.org_header_pk ?? row.pk))).map(row => row.org_header_pk ?? row.pk),
    added_links: links.filter(row => !row.pk).map(groupLinkInput),
    updated_links: links.filter(row => row.pk && byPk.has(comparable(row.pk)) && groupLinkKey(row) !== groupLinkKey(byPk.get(comparable(row.pk))))
      .map(row => ({ pk: row.pk, ...groupLinkInput(row) })),
    deleted_link_pks: originalLinks.filter(row => !currentPks.has(comparable(row.pk))).map(row => row.pk),
  }
}

/** 每页携带同一个版本，读取失败时不返回可用于保存的部分基线。 */
export async function loadGroupRows(fetchPage, params) {
  const rows = []
  let total = Infinity
  while (rows.length < total) {
    const { success, data } = await fetchPage({ ...params, SkipCount: rows.length, MaxResultCount: 200 })
    if (!success || !Array.isArray(data?.items) || !Number.isFinite(data?.totalCount)) {
      throw new Error('loadFailed')
    }
    if (total !== Infinity && total !== data.totalCount) {
      throw new Error('loadFailed')
    }
    total = data.totalCount
    if (rows.length < total && data.items.length === 0) {
      throw new Error('loadFailed')
    }
    rows.push(...data.items)
  }
  return rows
}
