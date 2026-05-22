/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// import VueApexCharts from 'vue3-apexcharts'

import router from '@/router'
import pinia from '@/stores'
import i18n from './vuei18n'
// Plugins
import vuetify from './vuetify'

export function registerPlugins(app) {
  app.use(pinia).use(i18n).use(vuetify).use(router)
  // .use(VueApexCharts)
}
