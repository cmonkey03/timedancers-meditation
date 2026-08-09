import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Timedancers Meditation',
  slug: 'timedancers-meditation',
  owner: "rustlemediallc",
  version: '1.0.0',
  android: {
    ...config.android,
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    package: 'org.timedancers.meditation',
    permissions: [
      'RECEIVE_BOOT_COMPLETED',
      'VIBRATE',
      'SCHEDULE_EXACT_ALARM',
      'USE_EXACT_ALARM',
    ],
  },
  ios: {
    ...config.ios,
    supportsTablet: true,
    bundleIdentifier: 'org.timedancers.meditation',
    infoPlist: {
      "ITSAppUsesNonExemptEncryption": false,
      "CFBundleDisplayName": "Timedancers",   // <= short label under the icon
      // Allow audio to continue in the background
      "UIBackgroundModes": ["audio", "fetch"],
      // Allow notifications to show when app is in background
      "UIRemoteNotificationTypes": ["alert", "badge", "sound"],
    }
  },
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'timedancers',
  userInterfaceStyle: 'automatic',
  extra: {
    eas: {
       projectId: "de8347b6-d666-4360-b7ec-791c9eee94cf",
    }
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-audio',
    'expo-asset',
    [
      'expo-notifications',
      {
        icon: './assets/images/favicon.png',
        color: '#2d5a3d',
        sounds: ['./assets/sounds/chime1.mp3', './assets/sounds/chime2.mp3'],
      },
    ],
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#000000',
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
