import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Clever Coffee',
  slug: 'clever-coffee',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './src/assets/images/icon.png',
  scheme: 'clevercoffee',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './src/assets/images/icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.kabanks.clevercoffee',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './src/assets/images/favicon.png',
  },
  plugins: ['expo-router', 'expo-localization', 'react-native-nfc-manager'],
  experiments: {
    typedRoutes: true,
  },
};

export default config;
