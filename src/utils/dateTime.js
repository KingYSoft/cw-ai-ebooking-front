/**
 * Normalize date/datetime text to `yyyy-MM-dd HH:mm:ss`.
 * Date-only values get `00:00:00`. Empty / invalid → `''`.
 */
export function ensureDateTimeSeconds(value) {
  const text = String(value ?? '').trim()
  if (!text) {
    return ''
  }

  const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/)
  if (match) {
    const date = `${match[1]}-${match[2]}-${match[3]}`
    const hh = match[4] ?? '00'
    const mm = match[5] ?? '00'
    const ss = match[6] ?? '00'
    return `${date} ${hh}:${mm}:${ss}`
  }

  return text
}
