import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  // Configuración base
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'dist/**',
      '*.config.js',
      '*.config.ts',
    ],
  },

  // Configuración Next.js (simplificada)
  ...compat.extends('next/core-web-vitals'),
  
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      // Permitir el uso de 'any' sin warnings
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      
      // Reglas básicas y relajadas
      'react-hooks/exhaustive-deps': 'off',
      'react/no-unescaped-entities': 'off',
      'prefer-const': 'off',
      'no-var': 'off',
      'no-console': 'off',
      
      // Permitir imports sin extensión
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
    },
  },
];

export default eslintConfig;