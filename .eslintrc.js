module.exports = {
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],

  parserOptions: {
    parser: '@babel/eslint-parser'
  },

  rules: {
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn'
  },

  root: true,

  env: {
    node: true
  }
}
