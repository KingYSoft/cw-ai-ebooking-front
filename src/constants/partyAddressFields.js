/** Party 表单字段 <-> 地址弹框/API 字段 */
export const PARTY_TO_DIALOG_FIELDS = [
  ['code', 'add_address_code'],
  ['company_name', 'add_address_name'],
  ['pk', 'add_address'],
  ['address1', 'add_address1'],
  ['address2', 'add_address2'],
  ['address3', 'add_address3'],
  ['phone', 'add_phone'],
  ['fax', 'add_fax'],
  ['contact', 'add_contact'],
  ['city', 'add_city'],
  ['state', 'add_state'],
  ['postal_code', 'add_postal_code'],
  ['country_code', 'add_country_code'],
  ['email', 'add_email'],
  ['mobile', 'add_mobile'],
  ['port_code', 'add_port_code'],
]

export const DIALOG_TO_PARTY_FIELDS = PARTY_TO_DIALOG_FIELDS.map(([dialogKey, partyKey]) => [
  partyKey,
  dialogKey,
])

export function mapPartyToDialogInput(party) {
  const input = {}
  PARTY_TO_DIALOG_FIELDS.forEach(([dialogKey, partyKey]) => {
    input[dialogKey] = party[partyKey] ?? ''
  })
  return input
}

export function mapDialogToParty(party, row) {
  DIALOG_TO_PARTY_FIELDS.forEach(([partyKey, dialogKey]) => {
    party[partyKey] = row[dialogKey]
  })
}

export function formatPartyAddressLine(party) {
  if (!party) {
    return ''
  }
  return [party.add_address1, party.add_address2, party.add_address3]
    .filter(value => value != null && value !== '')
    .join(', ')
}

export function hasPartyAddressData(party) {
  if (!party) {
    return false
  }
  if (party.add_address_name === 'SAME AS CONSIGNEE') {
    return false
  }
  return PARTY_TO_DIALOG_FIELDS.some(([, partyKey]) => {
    const value = party[partyKey]
    return value != null && value !== ''
  })
}
