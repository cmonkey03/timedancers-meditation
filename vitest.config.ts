import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/tests/**/*.test.{ts,tsx}'],
    exclude: [
      // Skip component tests that use @testing-library/react-native
      // These have module resolution issues with vitest
      'src/tests/animated-welcome-text.test.tsx',
      'src/tests/button.test.tsx', 
      'src/tests/use-fonts.test.ts',
      'src/tests/ring.test.tsx',
    ],
  },
});
