/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

import '@/assets/global.scss'
import '@/assets/ref-form.scss'
import '@/assets/table-filter.scss'
// Styles
import 'unfonts.css'

const app = createApp(App)

registerPlugins(app)

app.mount('#app')

const original = window.history.replaceState
window.history.replaceState = function (...args) {
  console.log(args, 'replaceState')

  if (args[2] === undefined) {
    // 防止 edge 无法 最小化
    return
  } else {
    // oooo(a, b, c, d)
    return original.apply(this, args)
  }
}
