// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  formatters: true,
  rules: {
    'vue/html-self-closing': 'off',
  },
})
