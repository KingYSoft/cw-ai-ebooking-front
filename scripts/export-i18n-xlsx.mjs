import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import XLSX from 'xlsx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')
const i18nDir = join(rootDir, 'src/i18n')

const localeFiles = {
  en: join(i18nDir, 'en.js'),
  zhHans: join(i18nDir, 'zhHans.js'),
  vi: join(i18nDir, 'vi.js'),
}

const moduleCache = new Map()

function resolveImportPath(fromFile, importPath) {
  const base = join(dirname(fromFile), importPath)
  return base.endsWith('.js') ? base : `${base}.js`
}

async function loadI18nModule(filePath) {
  const normalized = filePath
  if (moduleCache.has(normalized)) {
    return moduleCache.get(normalized)
  }

  const source = readFileSync(normalized, 'utf8')
  const importRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]\s*;?/g
  const deps = {}
  const depValues = []

  for (const match of source.matchAll(importRegex)) {
    const [, name, importPath] = match
    if (!(name in deps)) {
      const depPath = resolveImportPath(normalized, importPath)
      deps[name] = await loadI18nModule(depPath)
      depValues.push(deps[name])
    }
  }

  const depNames = Object.keys(deps)
  const body = source
    .replace(/^import\s+.+$/gm, '')
    .replace(/export\s+default\s+/, 'return ')

  // eslint-disable-next-line no-new-func
  const evaluate = new Function(...depNames, body)
  const result = evaluate(...depNames.map(name => deps[name]))

  moduleCache.set(normalized, result)
  return result
}

function flattenStrings(obj, prefix = '', result = {}) {
  if (obj == null || typeof obj !== 'object' || Array.isArray(obj)) {
    return result
  }

  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value != null && typeof value === 'object' && !Array.isArray(value)) {
      flattenStrings(value, path, result)
    } else if (typeof value === 'string') {
      result[path] = value
    }
  }

  return result
}

const localeData = {}
for (const [locale, filePath] of Object.entries(localeFiles)) {
  localeData[locale] = flattenStrings(await loadI18nModule(filePath))
}

const allKeys = [
  ...new Set([
    ...Object.keys(localeData.en),
    ...Object.keys(localeData.zhHans),
    ...Object.keys(localeData.vi),
  ]),
].sort((a, b) => a.localeCompare(b))

const rows = allKeys.map(key => ({
  Key: key,
  English: localeData.en[key] ?? '',
  '简体中文': localeData.zhHans[key] ?? '',
  '越南语': localeData.vi[key] ?? '',
}))

const worksheet = XLSX.utils.json_to_sheet(rows, {
  header: ['Key', 'English', '简体中文', '越南语'],
})

worksheet['!cols'] = [{ wch: 52 }, { wch: 48 }, { wch: 48 }, { wch: 48 }]

const workbook = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(workbook, worksheet, 'i18n')

const outputPath = join(rootDir, 'i18n-en-zhHans-vi.xlsx')
writeFileSync(outputPath, XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' }))

console.log(`Exported ${rows.length} translation keys to ${outputPath}`)
