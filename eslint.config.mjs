import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importX from 'eslint-plugin-import-x';
import unicorn from 'eslint-plugin-unicorn';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import perfectionist from 'eslint-plugin-perfectionist';
import prettierConfig from 'eslint-config-prettier/flat';
import globals from 'globals';

export default [
  // Ignore generated files and dependencies.
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
  },

  // Base JavaScript rules.
  js.configs.recommended,

  // TypeScript rules.
  {
    files: ['**/*.ts', '**/*.tsx'],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
      globals: {
        ...globals.node,
      },
    },

    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'import-x': importX,
      unicorn,
      'simple-import-sort': simpleImportSort,
      perfectionist,
    },

    rules: {
      // TypeScript.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          caughtErrors: 'none',
        },
      ],

      '@typescript-eslint/no-explicit-any': [
        'error',
        {
          fixToUnknown: false,
          ignoreRestArgs: false,
        },
      ],

      // Imports.
      'import-x/no-default-export': 'error',
      'import-x/no-unresolved': 'off',
      'import-x/named': 'error',
      'simple-import-sort/imports': 'error',

      // Sorting.
      'sort-keys': 'off',
      'perfectionist/sort-objects': [
        'error',
        {
          order: 'asc',
          type: 'alphabetical',
        },
      ],

      // Code style.
      'arrow-body-style': ['error', 'always'],
      'max-len': ['error', { code: 160 }],
    },
  },

  // Disable ESLint rules that conflict with Prettier.
  // Keep this last.
  prettierConfig,
];
