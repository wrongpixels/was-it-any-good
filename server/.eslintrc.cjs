module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  extends: ['eslint:recommended'],
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        semi: 'off',
        '@typescript-eslint/semi': ['error', 'always'],
        quotes: 'off',
        '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            vars: 'all',
            args: 'all',
            argsIgnorePattern: '^_', // Optional: allows _ prefix for intentionally unused params
            varsIgnorePattern: '^_',
            caughtErrors: 'all',
          },
        ],
      },
    },
    {
      files: ['*.js', '*.cjs'],
      rules: {
        semi: ['error', 'never'],
        quotes: ['error', 'single', { avoidEscape: true }],
      },
    },
  ],
}
