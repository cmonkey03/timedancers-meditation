# Timespin App

A meditation timer app built with Expo Router and React Native, featuring customizable session timers with phase-based timing and chime alerts.

## Features

- **Phase-based meditation timer** with customizable duration
- **Three-phase sessions**: Power, Heart, and Wisdom phases
- **Chime and haptic alerts** for phase transitions and completion
- **Background notification support** for timed sessions
- **Daily reminder notifications**
- **Theme customization** (light/dark/system)
- **Accessibility-focused design**

## Project Structure

```
timespin-app/
├── src/                      # All source code
│   ├── app/                   # Expo Router pages
│   ├── components/            # React components
│   ├── hooks/                 # Custom hooks
│   │   ├── session/          # Session-related hooks
│   │   ├── ui/               # UI-related hooks
│   │   └── platform/         # Platform-specific hooks
│   ├── utils/                 # Utility functions
│   ├── data/                  # Static data
│   ├── services/              # Business logic layer
│   ├── contexts/              # React contexts
│   ├── types/                 # TypeScript types
│   └── tests/                 # Unit tests
├── assets/                   # Static assets
├── e2e/                       # E2E tests
└── [config files]            # Configuration
```

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the development server

   ```bash
   npx expo start
   ```

3. Open the app in a development build or simulator

## Available Scripts

- `npm start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS  
- `npm run web` - Run on web
- `npm test` - Run unit tests
- `npm run lint` - Run ESLint
- `npm run e2e` - Run E2E tests

## Architecture

The app follows a clean architecture pattern:

- **Service Layer**: Centralized data persistence and business logic
- **Context Layer**: State management for sessions and themes
- **Component Layer**: Focused, reusable UI components
- **Hook Layer**: Organized custom hooks for different concerns

## Key Technologies

- **Expo Router** - File-based routing
- **React Native Reanimated** - Animations
- **Expo Notifications** - Local notifications
- **Expo Audio** - Sound playback
- **TypeScript** - Type safety

## Testing

- **Unit tests**: Vitest for logic testing
- **E2E tests**: Detox for end-to-end testing
- **38 unit tests** covering timer logic, notifications, and accessibility

## Development

The project uses a `src/` directory structure following React/Expo best practices. Path aliases are configured:
- `@/*` → `./src/*` (source code)
- `@/assets/*` → `./assets/*` (static assets)

## Documentation

- `BACKGROUND_BEHAVIOR.md` - Background app behavior documentation
- `DEPLOYMENT_SETUP.md` - Deployment setup instructions
- `REFACTORING_SUMMARY.md` - Recent refactoring details

## License

Private project