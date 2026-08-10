import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: [
      // Skip component tests that use @testing-library/react-native
      // These have module resolution issues with vitest
      'tests/animated-welcome-text.test.tsx',
      'tests/button.test.tsx', 
      'tests/use-fonts.test.ts',
      'tests/ring.test.tsx',
    ],
  },
});
