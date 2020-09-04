module.exports = {
  extends: ['founderlab'],
  parser: 'babel-eslint',
  rules: {
    'strict': 0,
  },
  overrides: [
    {
      files: [
        '**/*.test.js'
      ],
      env: {
        'jest/globals': true,
      },
      plugins: [
        'jest',
    ],
      rules: {
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
      }
    }
  ],
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true
    }
  }
}
