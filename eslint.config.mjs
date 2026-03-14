import { defineConfig } from 'eslint/config';
import baseConfig from './.config/eslint.config.mjs';

export default defineConfig([
  {
    ignores: ['**/logs', '**/*.log', '**/node_modules/', '**/coverage', '**/dist/', '**/.pnpm-store/'],
  },
  ...baseConfig,
]);
