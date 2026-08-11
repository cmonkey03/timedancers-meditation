module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
            '@/assets': './assets',
          },
        },
      ],
      // Reanimated v3+ uses worklets plugin. Keep this LAST.
      'react-native-worklets/plugin',
    ],
  };
};
