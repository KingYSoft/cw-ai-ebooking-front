/**
 * Shared “No. of Package” / pack-type remote picker.
 * Data: GET `/package-type/query-list` with query param `query` (empty string when opening menu).
 */
import { queryPackageTypeList } from '@/api/package_type'

/** Vuetify text-field props passed through `FRemoteTableMenu` (aligned across Booking + Shipment). */
export const packageTypeMenuTextFieldProps = Object.freeze({
  color: 'primary',
  width: 'auto',
  minWidth: '88px',
  variant: 'underlined',
})

export const packageTypeTableHeaders = Object.freeze([
  {
    title: 'Code',
    key: 'code',
    align: 'start',
    minWidth: '80',
    cellProps: { class: 'text-truncate' },
  },
  {
    title: 'Description',
    key: 'desc',
    align: 'start',
    minWidth: '180',
    cellProps: { class: 'text-truncate' },
  },
])

const mapPackageTypeApiRow = raw => {
  const code = raw?.code
  const desc = raw?.desc ?? raw?.description
  return {
    code: code == null ? '' : String(code),
    desc: desc == null ? '' : String(desc),
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

export const fetchPackageTypes = async params => {
  const query = String(params?.query ?? '').trim()
  try {
    const res = await queryPackageTypeList({ query })
    const { list: rawItems, totalCount: rawTotal } = extractListPayload(res)
    const items = rawItems.map(r => mapPackageTypeApiRow(r))
    const totalCount = Number(rawTotal) > 0 ? Number(rawTotal) : items.length
    return {
      data: {
        items,
        totalCount,
      },
    }
  } catch (error) {
    console.error('Failed to fetch package types:', error)
    return {
      data: {
        items: [],
        totalCount: 0,
      },
    }
  }
}

export const assignPackageTypeFromRow = (
  row,
  rowItem,
  fieldKey = 'ctr_pack_type',
  fieldKeyDesc = 'ctr_pack_type_desc',
) => {
  if (row) {
    rowItem[fieldKey] = row.code
    rowItem[fieldKeyDesc] = row.desc
  }
}
