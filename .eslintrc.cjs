// eslint-disable-next-line no-undef
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:unicorn/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', 'coverage', 'node_modules'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'simple-import-sort', 'typescript-sort-keys'],
  root: true,
  rules: {
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    'arrow-body-style': ['error', 'always'],
    'import/no-default-export': ['error'],
    'import/no-unresolved': 0,
    indent: ['error', 2],
    'max-len': ['error', { code: 160 }],
    'simple-import-sort/imports': ['error'],
    'sort-keys': [
      'error',
      'asc',
      {
        caseSensitive: true,
        natural: true,
      },
    ],
    'typescript-sort-keys/interface': 'error',
    'typescript-sort-keys/string-enum': 'error',
  },
};
