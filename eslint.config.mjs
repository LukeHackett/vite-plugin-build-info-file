import js from '@eslint/js';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import unicorn from 'eslint-plugin-unicorn';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import perfectionist from 'eslint-plugin-perfectionist';
import globals from 'globals';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  // Base ESLint recommended rules
  js.configs.recommended,

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      // Node globals
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      import: importPlugin,
      unicorn: unicorn,
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
      perfectionist: perfectionist,
    },
    rules: {
      // TypeScript rules
      'no-unused-vars': 'off', // disable base rule
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used', // report unused args only if last
          argsIgnorePattern: '^_', // ignore _prefix args
          ignoreRestSiblings: true,
          caughtErrors: 'none',
        },
      ],
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-explicit-any': [
        'error',
        {
          fixToUnknown: false,
          ignoreRestArgs: false,
        },
      ],

      // Import rules
      'import/no-default-export': 'error',
      'import/no-unresolved': 'off',
      'import/named': 'error',
      'simple-import-sort/imports': 'error',

      // Sorting rules
      'sort-keys': 'off',
      'perfectionist/sort-objects': ['error', { order: 'asc', type: 'alphabetical' }],

      // Style rules
      indent: ['error', 2],
      'arrow-body-style': ['error', 'always'],
      'max-len': ['error', { code: 160 }],

      // Prettier integration
      'prettier/prettier': 'error',
    },
  },
  {
    // Ignore build output and node_modules
    ignores: ['dist', 'coverage', 'node_modules'],
  },
];
