/** @type {import('jest').Config} */
module.exports = {
  testTimeout: 120000,
  testMatch: ['**/?(*.)+(e2e).[jt]s?(x)'],
  setupFilesAfterEnv: ['./init.ts'],
  reporters: ['detox/runners/jest/streamlineReporter'],
};
