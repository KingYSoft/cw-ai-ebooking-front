export const ORIGIN_TABLE_HEADERS = Object.freeze([
  {
    title: 'Code',
    key: 'rl_code',
    align: 'start',
    minWidth: '100',
    cellProps: { class: 'text-truncate' },
  },
  {
    title: 'Name',
    key: 'rl_port_name',
    align: 'start',
    minWidth: '180',
    cellProps: { class: 'text-truncate' },
  },
  {
    title: 'Country',
    key: 'rl_country_code',
    align: 'start',
    minWidth: '100',
    cellProps: { class: 'text-truncate' },
  },
])

export function originPortItems(originTypes = []) {
  return (originTypes || [])
    .map(item => ({
      ...item,
      rl_code: String(item?.rl_code ?? item?.code ?? '').trim(),
      rl_port_name: item?.rl_port_name ?? item?.desc ?? item?.name ?? '',
      rl_country_code: item?.rl_country_code ?? item?.country_code ?? '',
    }))
    .filter(item => item.rl_code)
}

export function fetchOriginTypesFromList(originTypes, params = {}) {
  const all = originPortItems(originTypes)
  const query = String(params.query ?? '').trim().toLowerCase()
  const filtered = query
    ? all.filter(item =>
        [item.rl_code, item.rl_port_name, item.rl_country_code].some(value =>
          String(value ?? '')
            .toLowerCase()
            .includes(query),
        ),
      )
    : all
  const skip = Number(params.skipCount) || 0
  const take = Number(params.maxResultCount) || 50

  return {
    data: {
      items: filtered.slice(skip, skip + take),
      totalCount: filtered.length,
    },
  }
}
