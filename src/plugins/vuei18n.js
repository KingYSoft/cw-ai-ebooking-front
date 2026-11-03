import { createI18n } from 'vue-i18n'
import { en, vi, zhHans, zhHant } from 'vuetify/locale'

import en__ from '@/i18n/en'
import vi__ from '@/i18n/vi'
import zhHans__ from '@/i18n/zhHans'
import zhHant__ from '@/i18n/zhHant'

const messages = {
  en: {
    $vuetify: {
      ...en,
      ...en__,
    },
  },
  zhHans: {
    $vuetify: {
      ...zhHans,
      ...zhHans__,
    },
  },
  zhHant: {
    $vuetify: {
      ...zhHant,
      ...zhHant__,
    },
  },
  vi: {
    $vuetify: {
      ...vi,
      ...vi__,
    },
  },
}

const datetimeFormats = {
  en: {
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
    long: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit',
      hour12: true,
    },
  },
  zhHans: {
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
    long: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit',
      hour12: false,
    },
  },
  zhHant: {
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
    long: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit',
      hour12: false,
    },
  },
  vi: {
    short: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
    long: {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      // second: '2-digit',
      hour12: false,
    },
  },
}

const i18n = createI18n({
  legacy: false, // Vuetify does not support the legacy mode of vue-i18n
  locale: 'en',
  //   fallbackLocale: 'en',
  messages,
  datetimeFormats,
})

export default i18n
