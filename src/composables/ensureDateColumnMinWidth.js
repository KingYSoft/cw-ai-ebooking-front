export const DATE_COLUMN_MIN_WIDTH_PX = 112

const DATE_KEY_PATTERN =
  /(^|_)(etd|eta|crd|date|time)(_|$)|cargo_ready|creationtime|creation_time/i

export function isDateLikeColumnKey(key) {
  return DATE_KEY_PATTERN.test(String(key ?? ''))
}

function parsePx(value) {
  if (value == null || value === '') {
    return 0
  }
  const n = typeof value === 'number' ? value : Number.parseInt(String(value), 10)
  return Number.isFinite(n) ? n : 0
}

export function ensureDateColumnMinWidth(headers) {
  if (!Array.isArray(headers)) {
    return headers
  }

  return headers.map(header => {
    if (!header || !isDateLikeColumnKey(header.key)) {
      return header
    }

    const current = Math.max(parsePx(header.minWidth), parsePx(header.width))
    if (current >= DATE_COLUMN_MIN_WIDTH_PX) {
      return header
    }

    return {
      ...header,
      minWidth: `${DATE_COLUMN_MIN_WIDTH_PX}px`,
    }
  })
}
