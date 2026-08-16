const tsParser = require('@typescript-eslint/parser');

module.exports = [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.next/**', 'website/**'],
  },
  {
    files: ['packages/emblor/**/*.{ts,tsx}', 'packages/emblor/playground/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {},
  },
];
