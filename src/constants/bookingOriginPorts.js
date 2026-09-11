/** Booking Origin dropdown — temporary fixed ports */
export const BOOKING_ORIGIN_PORTS = ['HKG', 'SHA', 'NGB', 'QDO', 'SZX', 'XMN'].map(rl_code => ({
  rl_code,
  rl_port_name: '',
}))

export function originPortItems(code, name) {
  const items = [...BOOKING_ORIGIN_PORTS]
  if (code && !items.some(item => item.rl_code === code)) {
    items.unshift({
      rl_code: code,
      rl_port_name: name || '',
    })
  }
  return items
}
