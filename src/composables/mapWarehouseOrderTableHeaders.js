export const WAREHOUSE_ADDR_TABLE_HEADER_KEYS = {
  code: 'code',
  org_code: 'code',
  company_name: 'companyName',
  address_code: 'addressCode',
  address1: 'address1',
  city: 'city',
  country_code: 'country',
}

export function mapWarehouseAddrTableHeaders(columns, addrTable) {
  return columns.map(col => ({
    ...col,
    title: addrTable(WAREHOUSE_ADDR_TABLE_HEADER_KEYS[col.key] ?? col.key),
  }))
}
