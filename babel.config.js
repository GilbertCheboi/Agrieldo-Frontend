module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  overrides: [
    {
      test: fileName => !fileName.includes('node_modules/react-native-maps'),
      plugins: [
        ['@babel/plugin-transform-class-properties', {loose: true}],
        ['@babel/plugin-transform-private-methods', {loose: true}],
        ['@babel/plugin-transform-private-property-in-object', {loose: true}],
      ],
    },
  ],
  plugins: [
    // any other plugins

    'react-native-reanimated/plugin', // Always keep this as the last plugin
  ],
};
