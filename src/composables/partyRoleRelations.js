export const partyColumns = ['agent', 'consignee', 'shipper']

export const normalizePartyPk = value => String(value ?? '').trim() || null
const keyPart = value => normalizePartyPk(value)?.toLowerCase() ?? null

export const relationKey = row =>
  JSON.stringify(partyColumns.map(column => keyPart(row[`${column}_org_header_pk`])))

export const relationRowKey = row => row.pk || row.client_key

export const hasParty = row =>
  partyColumns.some(column => normalizePartyPk(row[`${column}_org_header_pk`]))

export const relationPayload = row => ({
  ...(row.pk ? { pk: row.pk } : {}),
  ...Object.fromEntries(
    partyColumns.map(column => [
      `${column}_org_header_pk`,
      normalizePartyPk(row[`${column}_org_header_pk`]),
    ]),
  ),
})

// Only an empty suffix is replaceable. NULL in the parent prefix is an exact value.
export const isEmptyParent = (parent, child) => {
  const parentKeys = partyColumns.map(column => keyPart(parent[`${column}_org_header_pk`]))
  const childKeys = partyColumns.map(column => keyPart(child[`${column}_org_header_pk`]))
  const lastParent = parentKeys.findLastIndex(Boolean)
  const lastChild = childKeys.findLastIndex(Boolean)
  return (
    lastParent >= 0 &&
    lastParent < lastChild &&
    parentKeys.slice(0, lastParent + 1).every((value, index) => value === childKeys[index])
  )
}

export function addRelationBatch(existing, candidates) {
  const keys = new Set(existing.map(relationKey))
  const added = []
  let duplicateCount = 0
  for (const candidate of candidates) {
    if (!hasParty(candidate)) {
      throw new Error('partyRequired')
    }
    const key = relationKey(candidate)
    if (keys.has(key)) {
      duplicateCount++
      continue
    }
    keys.add(key)
    added.push({ ...candidate, client_key: candidate.client_key || '-' })
  }
  const retained = existing.filter(row => !added.some(child => isEmptyParent(row, child)))
  return {
    relations: [...retained, ...added],
    addedCount: added.length,
    replacedCount: existing.length - retained.length,
    duplicateCount,
  }
}

export function buildRelationChanges(original, current) {
  const byPk = new Map(original.map(row => [keyPart(row.pk), row]))
  const currentPks = new Set(current.filter(row => row.pk).map(row => keyPart(row.pk)))
  return {
    added_relations: current.filter(row => !row.pk).map(relationPayload),
    updated_relations: current
      .filter(row => row.pk && relationKey(row) !== relationKey(byPk.get(keyPart(row.pk)) || {}))
      .map(relationPayload),
    deleted_relation_pks: original
      .filter(row => !currentPks.has(keyPart(row.pk)))
      .map(row => row.pk),
  }
}

export function buildMergedRelationRows(relations) {
  // Use one display code per PK so a stale label cannot split an identical PK group.
  const codes = partyColumns.map(
    column =>
      new Map(
        relations.map(row => [
          keyPart(row[`${column}_org_header_pk`]),
          row[`${column}_org_code`] || '',
        ]),
      ),
  )
  const items = [...relations].sort((left, right) => {
    for (const [index, column] of partyColumns.entries()) {
      const leftPk = keyPart(left[`${column}_org_header_pk`])
      const rightPk = keyPart(right[`${column}_org_header_pk`])
      if (leftPk === rightPk) {
        continue
      }
      if (leftPk === null) {
        return -1
      }
      if (rightPk === null) {
        return 1
      }
      return (
        codes[index].get(leftPk).localeCompare(codes[index].get(rightPk)) ||
        leftPk.localeCompare(rightPk)
      )
    }
    return 0
  })
  const rows = items.map(relation => ({ relation, spans: [0, 0, 0] }))
  for (let column = 0; column < partyColumns.length; column++) {
    let start = 0
    while (start < rows.length) {
      const prefix = row =>
        JSON.stringify(
          partyColumns.slice(0, column + 1).map(name => keyPart(row[`${name}_org_header_pk`])),
        )
      const key = prefix(items[start])
      let end = start + 1
      while (end < rows.length && prefix(items[end]) === key) {
        end++
      }
      rows[start].spans[column] = end - start
      start = end
    }
  }
  return rows
}
