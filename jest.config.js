/** @type {import('jest').Config} */
module.exports = {
  // Detox 20 root Jest config for E2E only
  maxWorkers: 1,
  testTimeout: 120000,
  verbose: true,
  rootDir: '.',
  testMatch: ['<rootDir>/e2e/**/?(*.)+(e2e).[jt]s?(x)'],
  reporters: ['detox/runners/jest/reporter'],
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  testEnvironment: 'detox/runners/jest/testEnvironment',
  setupFilesAfterEnv: ['<rootDir>/e2e/init.ts'],
};
