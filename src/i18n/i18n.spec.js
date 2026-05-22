import { describe, expect, it } from 'vitest'

import i18n from '@/plugins/vuei18n'
import enMessages from './en'

const collectLeafPaths = (value, prefix = '') => {
  return Object.entries(value).flatMap(([key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key

    if (child && typeof child === 'object' && !Array.isArray(child)) {
      return collectLeafPaths(child, path)
    }

    return path
  })
}

const getPathValue = (value, path) => {
  return path.split('.').reduce((current, key) => current?.[key], value)
}

describe('vue i18n locales', () => {
  it('registers Traditional Chinese and Vietnamese with the same custom message keys as English', () => {
    const locales = i18n.global.availableLocales
    const englishCustomPaths = collectLeafPaths(enMessages.custom)

    expect(locales).toEqual(expect.arrayContaining(['zhHant', 'vi']))

    for (const locale of ['zhHant', 'vi']) {
      const customMessages = i18n.global.getLocaleMessage(locale).$vuetify.custom

      for (const path of englishCustomPaths) {
        expect(getPathValue(customMessages, path), `${locale}.${path}`).toEqual(
          expect.any(String),
        )
      }
    }
  })
})
