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
    },
    VSelect: {
      autocomplete: 'off',
    },
    VAutocomplete: {
      autocomplete: 'off',
    },
    VCombobox: {
      autocomplete: 'off',
    },
    VTextField: {
      variant: 'outlined',
      color: 'primary',
      autocomplete: 'off',
    },
    VTextarea: {
      variant: 'outlined',
      color: 'primary',
      autocomplete: 'off',
    },
    VCard: {
      elevation: 4,
      rounded: 'lg',
      border: '0',
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
          primary: '#2a5bd6', // '#04246a', // '#2a5bd6',  //'#8c57ff',
          'primary-sec': '#04246a',
          surface: '#ffffff',
          'on-surface': '#050505', // '#423b50',
          background: '#f4f5fa',
          // 'on-background': '#2e263d',
          'date-picker-background': '#ffffff',
          'on-date-picker-background': '#423b50',
          'surface-light': '#EDE7F6',
          'on-surface-light': '#423b50',
          'text-input-color': '#050505',
          'login-background': '#5B8C85',
          'login-background-sec': '#002B31',
          'fixed-table-tr-even': '#eaedf1',
        },
        variables: {
          'border-color': '5, 5, 5', // '33, 33, 33', // #212121
          'ttt-border-color': '214, 220, 228', // #d6dce4
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#9969ff', // '#a67cff', // '#9969ff',
          'primary-sec': '#42358d', // '#695ac4', // '#42358d', // 菜单选中 和 页面标题栏背景色
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
