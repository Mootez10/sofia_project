// backend/eslint.config.mjs
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';

import importPlugin from 'eslint-plugin-import';
import promisePlugin from 'eslint-plugin-promise';
import securityPlugin from 'eslint-plugin-security';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierDisable from 'eslint-config-prettier';

export default defineConfig([
  { ignores: ['node_modules/**', 'dist/**', 'coverage/**', '*.log', 'eslint.config.*'] },

  js.configs.recommended,

  {
    files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',       // change to 'module' if you use ESM in backend
      globals: globals.node,
    },
    plugins: {
      import: importPlugin,
      promise: promisePlugin,
      security: securityPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-underscore-dangle': 'off', // allow _id, __v in Mongoose

      // imports
      'import/order': ['warn', {
        groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      }],
      'import/no-unresolved': 'off', // enable if you want strict resolution

      // promises / security
      'security/detect-object-injection': 'off', // noisy with Mongoose
      'prettier/prettier': 'warn',
    },
  },

  // keep Prettier last to disable conflicting rules
  prettierDisable,
]);
