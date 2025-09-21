import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Timedancers Meditation',
  slug: 'timedancers-meditation',
  owner: "timedancers",
  version: '1.0.0',
  android: {
    ...config.android,
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: 'org.timedancers.meditation',
  },
  ios: {
    ...config.ios,
    supportsTablet: true,
    bundleIdentifier: 'org.timedancers.meditation',
    infoPlist: {
      "ITSAppUsesNonExemptEncryption": false,
      "CFBundleDisplayName": "Timedancers",   // <= short label under the icon
      // Allow audio to continue in the background (for future enhancements)
      "UIBackgroundModes": ["audio"]
    }
  },
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'timedancers',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
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
    'expo-notifications',
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
