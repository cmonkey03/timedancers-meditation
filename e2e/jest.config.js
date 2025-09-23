/** @type {import('jest').Config} */
module.exports = {
  // Detox 20 migration: use Detox's Jest runner bits
  maxWorkers: 1,
  testTimeout: 120000,
  verbose: true,
  testMatch: ['**/?(*.)+(e2e).[jt]s?(x)'],
  // Use Detox reporter and environment
  reporters: ['detox/runners/jest/reporter'],
  globalSetup: 'detox/runners/jest/globalSetup',
  globalTeardown: 'detox/runners/jest/globalTeardown',
  testEnvironment: 'detox/runners/jest/testEnvironment',
  // Keep our E2E bootstrapping (no init/cleanup inside anymore)
  setupFilesAfterEnv: ['./init.ts'],
  // Transform TS/JS using Expo's Babel preset
  transform: {
    '^.+\\.[jt]sx?$': ['babel-jest', { presets: ['babel-preset-expo'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  // Allow React Native / Expo packages to be transformed
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|react-native-.*|@react-native|expo|expo-.*|@expo/.*)/)'
  ],
  // Resolve our TS path alias
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
