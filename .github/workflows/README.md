# GitHub Workflows for TimeDancers Meditation App

This directory contains GitHub Actions workflows for automated testing and deployment of the TimeDancers Meditation app.

## 🔄 Workflows Overview

### 1. **Pull Request Checks** (`pr-checks.yml`)

**Triggers:** Pull requests to `main` or `develop` branches

**What it does:**

- ✅ Runs unit tests on every PR
- ✅ Runs linting checks
- 🧪 Runs E2E smoke tests (onboarding only) when PR has `needs-e2e` label or `[e2e]` in title
- 📊 Provides comprehensive PR summary

**Usage:**

```bash
# To trigger E2E tests on your PR, either:
# 1. Add the "needs-e2e" label to your PR
# 2. Include "[e2e]" in your PR title
```

### 2. **Full E2E Tests** (`e2e-tests.yml`)

**Triggers:** Pushes to `develop`, manual dispatch

**What it does:**

- 🧪 Runs complete unit test suite
- 📱 Builds iOS app for testing
- 🤖 Runs all E2E test suites (onboarding, meditation, settings)
- 📊 Uploads test artifacts on failure
- ⏱️ Timeout: 60 minutes

**Test Suites:**

- **Onboarding**: Tests the welcome flow and initial setup
- **Meditation**: Tests timer functionality and chakra orb interactions
- **Settings**: Tests configuration changes and preferences

### 3. **Deployment** (Handled by Expo GitHub App)

**Triggers:** Merges to `main` branch

**What Expo handles automatically:**

- 🚀 Builds iOS and Android apps
- 📱 Submits to App Store and Play Store
- 📦 Publishes EAS Updates for instant delivery
- 🏷️ Updates build status on PRs
- 📢 Provides deployment notifications

## 🛠️ Setup Requirements

### 1. Install Expo GitHub App

1. Go to [Expo GitHub App](https://github.com/apps/expo)
2. Install on your repository
3. Grant necessary permissions

**No tokens or secrets required!** The workflows run tests only - Expo handles deployment.

### 2. Expo Setup

```bash
# Install EAS CLI globally
npm install -g @expo/cli eas-cli

# Login to Expo
expo login

# Get your access token
expo whoami --json
```

### 3. iOS Simulator Requirements

The workflows use macOS runners with:

- **Device**: iPhone 16
- **iOS Version**: 18.4
- **Xcode**: Latest available on GitHub Actions

## 📊 Workflow Status Badges

Add these to your main README.md:

```markdown
[![E2E Tests](https://github.com/your-username/timedancers-meditation/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/your-username/timedancers-meditation/actions/workflows/e2e-tests.yml)
[![Deploy](https://github.com/your-username/timedancers-meditation/actions/workflows/deploy.yml/badge.svg)](https://github.com/your-username/timedancers-meditation/actions/workflows/deploy.yml)
[![PR Checks](https://github.com/your-username/timedancers-meditation/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/your-username/timedancers-meditation/actions/workflows/pr-checks.yml)
```

## 🚀 Deployment Process

### Automatic Deployment (Recommended)

1. **Develop**: Create feature branches and open PRs
2. **Test**: PR checks run automatically
3. **Merge**: Merge approved PRs to `main`
4. **Deploy**: Automatic deployment triggers on `main` push

### Manual Deployment

1. Go to **Actions** tab in GitHub
2. Select **Deploy to Production** workflow
3. Click **Run workflow**
4. Choose `main` branch and run

## 🧪 Testing Strategy

### Unit Tests

- Run on every PR and push
- Fast feedback (< 2 minutes)
- Test individual components and utilities

### E2E Smoke Tests (PR)

- Run only when explicitly requested
- Test critical user flows
- Prevent major regressions

### Full E2E Tests (Main/Develop)

- Run on every push to main branches
- Test complete app functionality
- Quality gate for deployments

## 📱 App Features Tested

Based on the meditation app's sophisticated features, our E2E tests cover:

### 🧘‍♀️ Meditation Experience

- **Chakra Orb System**: Tests the magical three-orb meditation interface
- **Phase-based Timer**: Validates settle, rebound, and witness phases
- **Drift Prevention**: Ensures accurate timing even with app backgrounding
- **Haptic Feedback**: Tests vibration on phase transitions
- **Audio Chimes**: Tests volume controls and chime functionality

### 🎨 UI/UX Testing

- **Design System**: Validates unified button design and spacing
- **Animations**: Tests smooth transitions and spring animations
- **Accessibility**: Ensures proper contrast ratios and screen reader support
- **Theme Support**: Tests light/dark theme switching

### ⚙️ Settings & Configuration

- **Volume Controls**: Tests chime volume slider functionality
- **Alert Modes**: Tests different notification preferences
- **Time Picker**: Tests meditation duration selection
- **Persistence**: Ensures settings are saved between sessions

## 🔧 Troubleshooting

### Common Issues

**iOS Simulator Not Booting:**

```bash
# The workflow automatically handles this, but locally:
xcrun simctl list devices
xcrun simctl boot "iPhone 16"
```

**Detox Build Failures:**

```bash
# Clear build cache
rm -rf ios/build
npm run detox:build
```

**E2E Test Timeouts:**

- Check simulator is properly booted
- Ensure app is built successfully
- Review test artifacts for specific failures

### Debugging Failed Tests

1. **Check Artifacts**: Download test artifacts from failed workflow runs
2. **Local Testing**: Run the same test suite locally
3. **Verbose Logs**: Use `--verbose` flag for detailed output
4. **Simulator Reset**: Reset iOS simulator if tests behave unexpectedly

## 📈 Performance Optimizations

### Caching Strategy

- **Node Modules**: Cached based on `package-lock.json`
- **iOS Builds**: Cached based on iOS files and dependencies
- **Xcode DerivedData**: Cached to speed up subsequent builds

### Parallel Execution

- Unit tests run in parallel with linting
- E2E suites run sequentially for stability
- Build caching reduces redundant compilation

## 🎯 Best Practices

### For Developers

1. **Write Tests First**: Add E2E tests for new features
2. **Use PR Labels**: Add `needs-e2e` for critical changes
3. **Keep Tests Fast**: Optimize test scenarios for quick feedback
4. **Monitor Artifacts**: Check test artifacts when debugging

### For Reviewers

1. **Check Test Status**: Ensure all checks pass before merging
2. **Review Test Changes**: Validate new test scenarios
3. **Consider E2E Impact**: Request E2E tests for UI/UX changes

## 📚 Additional Resources

- [Detox Documentation](https://wix.github.io/Detox/)
- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)

---

Built with ❤️ for mindful timedancing 🧘‍♀️✨
