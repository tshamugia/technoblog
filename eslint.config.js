const js = require('@eslint/js');
const stylistic = require('@stylistic/eslint-plugin');

module.exports = [
  js.configs.recommended,
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'no-console': 'on',
      '@stylistic/indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
    },
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'commonjs',
    },
  },
];
