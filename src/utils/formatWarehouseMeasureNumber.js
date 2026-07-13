import Decimal from 'decimal.js'

export const WAREHOUSE_MEASURE_DECIMALS = 3

export function roundWarehouseMeasureNumber(value, precision = WAREHOUSE_MEASURE_DECIMALS) {
  if (value == null || value === '') {
    return null
  }
  const text = String(value).trim().replace(/,/g, '')
  if (text === '') {
    return null
  }
  try {
    const n = new Decimal(text)
    if (!n.isFinite()) {
      return null
    }
    return Number(n.toDecimalPlaces(precision, Decimal.ROUND_HALF_UP))
  } catch {
    return null
  }
}

export function formatWarehouseMeasureNumber(value, precision = WAREHOUSE_MEASURE_DECIMALS) {
  const rounded = roundWarehouseMeasureNumber(value, precision)
  if (rounded == null) {
    return ''
  }
  return rounded.toFixed(precision)
}
