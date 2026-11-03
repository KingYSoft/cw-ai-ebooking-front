/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

import { useI18n } from 'vue-i18n'
// Composables
import { createVuetify } from 'vuetify'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
// import { en, zhHans } from 'vuetify/locale'

import i18n from './vuei18n'
// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// import zhHans__ from '@/i18n/zhHans'
// import en__ from '@/i18n/en'

// const messages = {
//   en: {
//     ...en,
//     ...en__,
//   },
//   zhHans: {
//     ...zhHans,
//     ...zhHans__,
//   },
// }

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
const vuetify = createVuetify({
  defaults: {
    VBtn: {
      class: 'text-none',
      rounded: 'lg',
    },
    VSelect: {
      autocomplete: 'off',
      rounded: 'lg',
    },
    VAutocomplete: {
      autocomplete: 'off',
      rounded: 'lg',
    },
    VCombobox: {
      autocomplete: 'off',
      rounded: 'lg',
    },
    VTextField: {
      variant: 'outlined',
      color: 'primary',
      autocomplete: 'off',
      rounded: 'lg',
    },
    VTextarea: {
      variant: 'outlined',
      color: 'primary',
      autocomplete: 'off',
      rounded: 'lg',
    },
    VCard: {
      elevation: 0,
      rounded: 'lg',
      border: true,
    },
    VChip: {
      rounded: 'lg',
    },
    VTabs: {
      color: 'primary',
    },
    VDataTable: {
      density: 'compact',
    },
    VDataTableVirtual: {
      density: 'compact',
    },
    VList: {
      density: 'compact',
      // class: 'pa-0',
    },
    VDialog: {
      persistent: true,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#0e7490',
          'primary-darken-1': '#155e75',
          'primary-sec': '#075985',
          secondary: '#0f766e',
          surface: '#ffffff',
          'on-surface': '#1e293b',
          background: '#f1f5f9',
          'on-background': '#1e293b',
          'date-picker-background': '#ffffff',
          'on-date-picker-background': '#1e293b',
          'surface-light': '#f8fafc',
          'on-surface-light': '#334155',
          'text-input-color': '#1e293b',
          'login-background': '#0e7490',
          'login-background-sec': '#0b192e',
          'fixed-table-tr-even': '#f8fafc',
          nav: '#0b192e',
          'on-nav': '#94a3b8',
        },
        variables: {
          'border-color': '15, 23, 42',
          'border-opacity': 0.12,
          'ttt-border-color': '226, 232, 240',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#22d3ee',
          'primary-sec': '#0e7490',
          surface: '#312d4b', // 卡片 背景色
          'on-surface': '#e7e3fc', // 卡片 文字颜色
          background: '#28243d', // 整体背景颜色
          // 'on-background': '#e7e3fc',
          'date-picker-background': '#403a6d', // date picker 背景色
          'on-date-picker-background': '#eeeeee', // date picker 文字颜色
          'surface-light': '#4f4870', // v-tool-bar 背景色
          'on-surface-light': '#e7e3fc', // v-tool-bar 文字颜色
          'text-input-color': '#e7e3fc',
          'login-background': '#5B8C85',
          'login-background-sec': '#002B31',
          'fixed-table-tr-even': '#3f3a5d',
          nav: '#0b192e',
          'on-nav': '#94a3b8',
        },
        variables: {
          'border-color': '231, 227, 252', // '238, 238, 238', // #eeeeee
          'ttt-border-color': '79, 72, 112', // #4f4870
        },
      },
    },
  },
  // locale: {
  //   locale: 'en',
  //   messages,
  // },
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  display: {
    mobileBreakpoint: 1380,
    thresholds: {
      xs: 600, // 0
      sm: 840, // 600
      md: 1145, // 960
      lg: 1545, // 1280
      xl: 1920, // 1920
      xxl: 2560,
    },
  },
})
export default vuetify
