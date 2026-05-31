import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

// Next.js 16 ships native flat configs; FlatCompat is no longer needed
// (and crashes ESLint 9's eslintrc validator on eslint-plugin-react's
// self-referential `configs` object).
export default [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: ['**/dist/**', '**/.next/**', '**/node_modules/**'],
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      // App Router only — no `pages/` directory exists anywhere in the project.
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
];
