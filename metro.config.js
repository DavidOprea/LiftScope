const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Tell Metro to bundle .tflite files as raw assets
config.resolver.assetExts.push('tflite');

module.exports = config;