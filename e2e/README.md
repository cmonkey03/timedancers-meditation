# E2E Testing with Detox

This directory contains end-to-end tests for the Timespin Session app using Detox.

## Test Files

- `onboarding.e2e.ts` - Tests the app onboarding flow
- `session.e2e.ts` - Tests session functionality (start, pause, resume, cancel)
- `settings.e2e.ts` - Tests settings configuration (theme, alerts, daily reminders)

## Setup

1. **Install dependencies** (if not already done):

   ```bash
   npm install
   ```

2. **Install Detox CLI globally** (if not already done):

   ```bash
   npm install -g detox-cli
   ```

3. **Initialize Detox framework cache** (one-time setup):

   ```bash
   detox clean-framework-cache && detox build-framework-cache
   ```

That's it! The test runner scripts handle building the app automatically.

## Running Tests

### 🚀 Quick Start - Run All Tests (Recommended)

```bash
# Build app, run unit tests, and run all E2E test suites with comprehensive reporting
npm run e2e
# or
npm run test:all
```

### 🎯 Convenient Test Runner Options

```bash
# Run all tests with verbose output
npm run e2e:verbose

# Skip build and run all tests (if app is already built)
npm run e2e:skip-build

# Run only unit tests (fast feedback)
npm run test:unit-only

# Run only E2E tests (skip unit tests)
npm run test:e2e-only
# or
npm run e2e:skip-unit

# Run specific E2E test suites
npm run e2e:onboarding
npm run e2e:session
npm run e2e:settings
```

### 🔧 Advanced Script Usage

The test runner script provides additional options:

```bash
# Direct script usage (macOS/Linux)
./scripts/run-e2e-tests.sh [OPTIONS]

# Windows
scripts\run-e2e-tests.bat [OPTIONS]

# Available options:
--skip-build          # Skip the build step
--skip-unit          # Skip unit tests (run only E2E tests)
--verbose            # Run with verbose output
--suite <name>       # Run specific suite (onboarding|session|settings)
--help              # Show help message

# Examples:
./scripts/run-e2e-tests.sh --verbose --suite session
./scripts/run-e2e-tests.sh --skip-build
```

### 📊 Test Runner Features

- **Unit + E2E Integration**: Runs both unit tests and E2E tests in sequence
- **Automatic building**: Builds the app before running tests (unless `--skip-build`)
- **Comprehensive reporting**: Shows pass/fail status for unit tests and each E2E test suite
- **Smart test selection**: Skips unit tests when running specific E2E suites
- **Error handling**: Stops on build failures, continues through test failures
- **Colored output**: Easy-to-read status messages with colors
- **Cross-platform**: Works on macOS, Linux, and Windows
- **Flexible execution**: Run all tests, specific types, or individual suites
- **Debugging tips**: Provides helpful debugging information on failures

### 🛠️ Legacy Detox Commands

You can still use the direct Detox commands if needed:

```bash
# Build and run all tests (basic)
npm run detox:build
npm run detox:test

# Run specific test suites (basic)
npm run detox:test:session
npm run detox:test:settings
npm run detox:test:onboarding

# Run with specific configurations
detox test -c ios.debug --loglevel verbose
detox test -c ios.debug e2e/session.e2e.ts

- **Start/Pause/Resume/Cancel Flow**: Tests the complete session session lifecycle
- **Ring States**: Verifies that session rings display correctly with proper accessibility labels
- **Duration Selection**: Tests changing session duration
- **Session Completion**: Tests session session completion (note: uses default 5-minute duration)

### Settings Tests (`settings.e2e.ts`)

- **Theme Switching**: Tests switching between System, Light, and Dark themes
- **Alert Configuration**: Tests selecting different alert modes (Chime, Chime + Vibrate, Vibrate, Silent)
- **Alert Testing**: Tests the "Test alert" functionality
- **Background Alerts**: Tests toggling background alert notifications
- **Daily Reminders**: Tests enabling/disabling daily reminder notifications
- **Reset to Defaults**: Tests resetting all settings to their default values
- **Navigation**: Tests navigating between Settings and Session screens

### Onboarding Tests (`onboarding.e2e.ts`)

- **Complete Onboarding Flow**: Tests going through all onboarding screens and landing on the session screen

## Test IDs

The tests use `testID` props for reliable element selection:

### Session Screen

- `screen-session` - Main session screen container

### Settings Screen

- `screen-settings` - Main settings screen container
- `theme-system`, `theme-light`, `theme-dark` - Theme selection buttons
- `alert-mode-chime`, `alert-mode-chime_haptic`, `alert-mode-haptic`, `alert-mode-silent` - Alert mode buttons
- `test-alert-button` - Test alert button
- `background-alerts-switch` - Background alerts toggle switch
- `daily-reminder-switch` - Daily reminder toggle switch
- `daily-reminder-time-button` - Daily reminder time selection button
- `reset-defaults-button` - Reset to defaults button

## Debugging Tests

### View test artifacts

Test artifacts (screenshots, videos, logs) are saved to `e2e/artifacts/` when tests fail.

### Common issues

1. **Element not found**: Check if the element has the correct `testID` or text
2. **Timing issues**: Increase timeout values or add delays between actions
3. **App state**: Ensure the app is in the expected state before running tests
4. **Simulator issues**: Reset the iOS simulator if tests behave unexpectedly

### Debug commands

```bash
# Run with verbose logging
detox test -c ios.debug --loglevel verbose

# Run with debug mode (keeps simulator open)
detox test -c ios.debug --debug-synchronization

# Take screenshots during test execution
detox test -c ios.debug --take-screenshots all
```

## Best Practices

1. **Use testIDs**: Always prefer `testID` over text-based selectors for reliability
2. **Wait for elements**: Use `waitFor()` with appropriate timeouts
3. **Clean state**: Each test should start from a clean state
4. **Realistic delays**: Add small delays between actions to simulate real user behavior
5. **Accessibility**: Tests also verify accessibility labels and roles

## CI/CD Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions step
- name: Run E2E Tests
  run: |
    npm run detox:build
    npm run detox:test
```

## Notes

- Tests are configured to run on iPhone 16 simulator
- The app is reinstalled before each test suite to ensure clean state
- Notification permissions are granted automatically during test setup
- Some tests may require longer timeouts due to animation durations
