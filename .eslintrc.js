module.exports = {
  extends: ['standard-with-typescript', 'plugin:react/recommended'],
  parserOptions: {
    project: ['./tsconfig.json', './tsconfig.client.json']
  },
  plugins: ['react'],
  rules: {
    '@typescript-eslint/strict-boolean-expressions': 1,
    'react/prop-types': 0
  }
}
