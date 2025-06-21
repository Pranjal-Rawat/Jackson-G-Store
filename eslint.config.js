// eslint.config.js
import { FlatCompat } from '@eslint/eslintrc';
import tsEslintPlugin from '@typescript-eslint/eslint-plugin';

const compat = new FlatCompat();

export default [
  ...compat.extends('next/core-web-vitals'),
  {
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    }
  }
];
