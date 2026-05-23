/**
 * Container type remote picker — GET `/dict/query-container-type-list` with param `query`.
 */
import { queryContainerTypeList } from '@/api/containers'

export const containerTypeTableHeaders = Object.freeze([
  {
    title: 'Code',
    key: 'code',
    align: 'start',
    minWidth: '100',
    cellProps: { class: 'text-truncate' },
  },
  {
    title: 'Description',
    key: 'description',
    align: 'start',
    minWidth: '220',
    cellProps: { class: 'text-truncate' },
  },
])

const mapContainerTypeApiRow = raw => {
  const code = raw?.code
  const description = raw?.description ?? raw?.desc
  return {
    code: code == null ? '' : String(code),
    description: description == null ? '' : String(description),
  }
}

const extractListPayload = res => {
  if (!res) {
    return { list: [], totalCount: 0 }
  }
  if (Array.isArray(res?.items)) {
    return {
      list: res.items,
      totalCount: Number(res?.totalCount ?? res.items.length),
    }
  }
  const payload = res.data == null ? res : res.data
  if (Array.isArray(payload)) {
    return { list: payload, totalCount: payload.length }
  }
  if (Array.isArray(payload?.items)) {
    return {
      list: payload.items,
      totalCount: Number(payload?.totalCount ?? payload.items.length),
    }
  }
  if (Array.isArray(payload?.list)) {
    return {
      list: payload.list,
      totalCount: Number(payload?.totalCount ?? payload.list.length),
    }
  }
  return { list: [], totalCount: 0 }
}

export const fetchContainerTypes = async params => {
  const query = String(params?.query ?? '').trim()
  try {
    const res = await queryContainerTypeList({ query })
    const { list: rawItems, totalCount: rawTotal } = extractListPayload(res)
    const items = rawItems.map(r => mapContainerTypeApiRow(r))
    const totalCount = Number(rawTotal) > 0 ? Number(rawTotal) : items.length
    return {
      data: {
        items,
        totalCount,
      },
    }
  } catch (error) {
    console.error('Failed to fetch container types:', error)
    return {
      data: {
        items: [],
        totalCount: 0,
      },
    }
  }
}

/** Apply selected row `code` to `rowItem[fieldKey]` (e.g. `ctr_type` or `type`). */
export const assignContainerTypeFromRow = (row, rowItem, fieldKey = 'ctr_type') => {
  if (row) {
    rowItem[fieldKey] = row.code
  }
}
