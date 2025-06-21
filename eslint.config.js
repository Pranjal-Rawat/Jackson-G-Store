// eslint.config.js
import { FlatCompat } from '@eslint/eslintrc';

// Set up FlatCompat for legacy 'extends'
const compat = new FlatCompat();

export default [
  ...compat.extends('next/core-web-vitals'),
  // You can add more custom rules or plugins here, for example:
  // {
  //   rules: {
  //     'no-console': 'warn',
  //   },
  // },
];
