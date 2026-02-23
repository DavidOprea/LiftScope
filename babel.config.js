module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // ... your other plugins
      ['react-native-worklets-core/plugin'], // <--- ADD THIS LINE
    ],
  };
};