const mockOrgAddresses = [
  {
    id: 1,
    pk: 'addr-1',
    code: 'SHP001',
    company_name: 'ABC Trading Co.',
    address_type: 'SHIPPER',
    address1: '88 Export Road',
    address2: 'Pudong',
    address3: 'Shanghai',
    city: 'Shanghai',
    country_code: 'CN',
  },
  {
    id: 2,
    pk: 'addr-2',
    code: 'SHP002',
    company_name: 'Global Export Inc.',
    address_type: 'SHIPPER',
    address1: 'Unit 5 Industrial Park',
    address2: '',
    address3: '',
    city: 'Shenzhen',
    country_code: 'CN',
  },
  {
    id: 3,
    pk: 'addr-3',
    code: 'CNE001',
    company_name: 'XYZ Logistics Ltd.',
    address_type: 'CONSIGNEE',
    address1: '12 Harbor Street',
    address2: '',
    address3: '',
    city: 'Los Angeles',
    country_code: 'US',
  },
  {
    id: 4,
    pk: 'addr-4',
    code: 'CNE002',
    company_name: 'Pacific Import Pte',
    address_type: 'CONSIGNEE',
    address1: 'Airport Boulevard',
    address2: '',
    address3: '',
    city: 'Singapore',
    country_code: 'SG',
  },
  {
    id: 5,
    pk: 'addr-5',
    code: 'NTF001',
    company_name: 'Notify Agent HK',
    address_type: 'NOTIFY_PARTY',
    address1: '1 Finance Street',
    address2: '',
    address3: '',
    city: 'Hong Kong',
    country_code: 'HK',
  },
]

/** 模拟 organizationQueryOrgAddress，供 FRemoteTableMenu 使用 */
export function queryMockOrgAddress(params) {
  const type = params?.address_type
  const query = String(params?.query ?? '').toLowerCase()
  let list = mockOrgAddresses.filter(row => !type || row.address_type === type)
  if (query) {
    list = list.filter(
      row =>
        String(row.company_name ?? '').toLowerCase().includes(query)
        || String(row.code ?? '').toLowerCase().includes(query),
    )
  }
  const skip = params?.skipCount ?? 0
  const max = params?.maxResultCount ?? 50
  const items = list.slice(skip, skip + max)
  return Promise.resolve({
    data: {
      items,
      totalCount: list.length,
    },
  })
}
