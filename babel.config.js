module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Reanimated v3+ uses worklets plugin. Keep this LAST.
      'react-native-worklets/plugin',
    ],
  };
};
