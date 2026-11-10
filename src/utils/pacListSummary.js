import Decimal from 'decimal.js'

const PLAIN_DECIMAL_PATTERN = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/
const GROUPED_DECIMAL_PATTERN = /^[+-]?\d{1,3}(?:,\d{3})+(?:\.\d*)?$/
const MAX_NUMERIC_LENGTH = 64

const BOOKING_HEADER_FIELDS = {
  grossValue: 'bkg_actual_weight',
  grossUnit: 'bkg_unit_of_weight',
  volumeValue: 'bkg_actual_volume',
  volumeUnit: 'bkg_unit_of_volume',
  packsValue: 'bkg_total_package_count',
  packsUnit: 'bkg_pack_type',
  packsDesc: 'bkg_pack_type_desc',
}

const asRecord = value => {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value
  }
  return {}
}

const parseNumber = value => {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return { decimal: new Decimal(0), valid: false }
    }
    return { decimal: new Decimal(value), valid: true }
  }

  if (typeof value !== 'string' && value !== null && value !== undefined) {
    return { decimal: new Decimal(0), valid: false }
  }

  const text = String(value ?? '').trim()
  if (text === '') {
    return { decimal: new Decimal(0), valid: true }
  }
  if (
    text.length > MAX_NUMERIC_LENGTH ||
    (!PLAIN_DECIMAL_PATTERN.test(text) && !GROUPED_DECIMAL_PATTERN.test(text))
  ) {
    return { decimal: new Decimal(0), valid: false }
  }

  const decimal = new Decimal(text.replace(/,/g, ''))
  if (!decimal.isFinite()) {
    return { decimal: new Decimal(0), valid: false }
  }
  return { decimal, valid: true }
}

const normalizeUnit = value =>
  String(value ?? '')
    .trim()
    .toUpperCase()

const resolvePackageType = packageTypes => {
  if (packageTypes.length === 0) {
    return ''
  }
  const distinctTypes = new Set(packageTypes)
  return distinctTypes.size === 1 ? packageTypes[0] : 'PKG'
}

const getPacListPackageSummary = inputData => {
  const record = asRecord(inputData)
  const rows = Array.isArray(record.pac_list) ? record.pac_list : []
  const packageTypes = rows.map(row => normalizeUnit(asRecord(row).pac_pack_type)).filter(Boolean)
  const type = resolvePackageType(packageTypes)

  if (type === 'PKG') {
    return { type, desc: 'Package' }
  }

  const firstRow = asRecord(rows[0])
  return { type, desc: String(firstRow.pac_pack_type_desc ?? '').trim() }
}

const buildPacListReconciliation = inputData => {
  const record = asRecord(inputData)
  const rawPacList = record.pac_list
  const hasInvalidStructure =
    rawPacList !== null && rawPacList !== undefined && !Array.isArray(rawPacList)
  const rows = Array.isArray(rawPacList) ? rawPacList : []

  const totals = {
    gross: new Decimal(0),
    volume: new Decimal(0),
    packs: new Decimal(0),
  }
  const grossUnitSet = new Set()
  const volumeUnitSet = new Set()
  let hasInvalidNumber = false
  let hasEmptyGrossUnit = false
  let hasNonEmptyGrossUnit = false
  let hasEmptyVolumeUnit = false
  let hasNonEmptyVolumeUnit = false
  let hasEmptyPackageType = false
  let hasNonEmptyPackageType = false

  for (const rowValue of rows) {
    const row = asRecord(rowValue)
    const gross = parseNumber(row.pac_gross_weight)
    const volume = parseNumber(row.pac_actual_volume)
    const packs = parseNumber(row.pac_package_count)

    totals.gross = totals.gross.plus(gross.decimal)
    totals.volume = totals.volume.plus(volume.decimal)
    totals.packs = totals.packs.plus(packs.decimal)
    hasInvalidNumber ||= !gross.valid || !volume.valid || !packs.valid

    const grossUnit = normalizeUnit(row.pac_weight_unit)
    const volumeUnit = normalizeUnit(row.pac_actual_volume_uom)
    const packageType = normalizeUnit(row.pac_pack_type)

    hasEmptyGrossUnit ||= grossUnit === ''
    hasNonEmptyGrossUnit ||= grossUnit !== ''
    hasEmptyVolumeUnit ||= volumeUnit === ''
    hasNonEmptyVolumeUnit ||= volumeUnit !== ''
    hasEmptyPackageType ||= packageType === ''
    hasNonEmptyPackageType ||= packageType !== ''
    if (grossUnit) {
      grossUnitSet.add(grossUnit)
    }
    if (volumeUnit) {
      volumeUnitSet.add(volumeUnit)
    }
  }

  return {
    totals,
    grossUnits: grossUnitSet,
    volumeUnits: volumeUnitSet,
    hasRows: rows.length > 0,
    hasInvalidStructure,
    hasInvalidNumber,
    hasPartialMissingUnit:
      (hasEmptyGrossUnit && hasNonEmptyGrossUnit) || (hasEmptyVolumeUnit && hasNonEmptyVolumeUnit),
    hasPartialMissingPackageType: hasEmptyPackageType && hasNonEmptyPackageType,
  }
}

const normalizeCompoundUnit = value => {
  const units = String(value ?? '')
    .split('/')
    .map(normalizeUnit)
    .filter(Boolean)
  return new Set(units)
}

const haveSameUnits = (left, right) => {
  if (left.size !== right.size) {
    return false
  }
  return [...left].every(unit => right.has(unit))
}

const sameRoundedNumber = (headerValue, total, fractionDigits) => {
  const parsedHeader = parseNumber(headerValue)
  if (!parsedHeader.valid) {
    return false
  }
  return parsedHeader.decimal
    .toDecimalPlaces(fractionDigits, Decimal.ROUND_HALF_UP)
    .equals(total.toDecimalPlaces(fractionDigits, Decimal.ROUND_HALF_UP))
}

export const isBookingHeaderPacMismatch = inputData => {
  const record = asRecord(inputData)
  const reconciliation = buildPacListReconciliation(record)

  if (!reconciliation.hasRows && !reconciliation.hasInvalidStructure) {
    return false
  }
  if (
    reconciliation.hasInvalidStructure ||
    reconciliation.hasInvalidNumber ||
    reconciliation.hasPartialMissingUnit ||
    reconciliation.hasPartialMissingPackageType
  ) {
    return true
  }

  const packageSummary = getPacListPackageSummary(record)
  return (
    !sameRoundedNumber(record[BOOKING_HEADER_FIELDS.grossValue], reconciliation.totals.gross, 5) ||
    !sameRoundedNumber(record[BOOKING_HEADER_FIELDS.volumeValue], reconciliation.totals.volume, 5) ||
    !sameRoundedNumber(record[BOOKING_HEADER_FIELDS.packsValue], reconciliation.totals.packs, 0) ||
    !haveSameUnits(
      reconciliation.grossUnits,
      normalizeCompoundUnit(record[BOOKING_HEADER_FIELDS.grossUnit]),
    ) ||
    !haveSameUnits(
      reconciliation.volumeUnits,
      normalizeCompoundUnit(record[BOOKING_HEADER_FIELDS.volumeUnit]),
    ) ||
    packageSummary.type !== normalizeUnit(record[BOOKING_HEADER_FIELDS.packsUnit]) ||
    (packageSummary.type !== 'PKG' &&
      packageSummary.desc !== String(record[BOOKING_HEADER_FIELDS.packsDesc] ?? '').trim())
  )
}
