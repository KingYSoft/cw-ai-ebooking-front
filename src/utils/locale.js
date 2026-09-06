const htmlLangMap = {
  en: 'en',
  zhHans: 'zh-CN',
  zhHant: 'zh-TW',
  vi: 'vi',
}

const facadeCultureMap = {
  en: 'en',
  zhHans: 'zh-Hans',
  zhHant: 'zh-Hant',
  vi: 'vi',
}

export const getHtmlLang = locale => htmlLangMap[locale] || htmlLangMap.en

export const getFacadeLanguageCulture = locale => facadeCultureMap[locale] || facadeCultureMap.en
