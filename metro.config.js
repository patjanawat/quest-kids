const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Force Metro to use CJS instead of ESM for packages that use import.meta
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
