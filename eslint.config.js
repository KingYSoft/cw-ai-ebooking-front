// import vuetify from 'eslint-config-vuetify'

// export default vuetify()

import vuetify from 'eslint-config-vuetify'
import { defineConfig } from 'eslint/config'
const config_arr = await vuetify()
config_arr.push({
  name: 'custom/app',
  rules: {
    'antfu/top-level-function': 'off',
    'unicorn/prefer-structured-clone': 'off',
    'unicorn/prefer-includes': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-for-loop': 'off',
    'unicorn/no-lonely-if': 'off',
    'unicorn/prefer-ternary': 'off',
    'unicorn/no-array-sort': 'off',
    'unicorn/no-this-assignment': 'off',
    '@stylistic/space-before-function-paren': 'off',
    '@stylistic/comma-dangle': 'off',
    'unicorn/prefer-native-coercion-functions': 'off',
    'unicorn/prefer-string-raw': 'off',
    'unicorn/prefer-array-some': 'off',
    'unicorn/prefer-array-index-of': 'off',
    'unicorn/consistent-existence-index-check': 'off',
    'unicorn/prefer-logical-operator-over-ternary': 'off',
    'unicorn/prefer-switch': 'off',
    'unicorn/prefer-date-now': 'off',
    'unicorn/prefer-at': 'off',
    '@stylistic/operator-linebreak': 'off',
    '@stylistic/quote-props': 'off',
    'vue/max-attributes-per-line': 'off',
  },
})
// console.log(config_arr)

export default defineConfig(config_arr)
