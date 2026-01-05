/** @type {import('react-native-worklets/plugin').PluginOptions} */
const workletsPluginOptions = {
  // Your custom options.
}

module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    ['react-native-unistyles/plugin', {
      // pass root folder of your application
      // all files under this folder will be processed by the Babel plugin
      // if you need to include more folders, or customize discovery process
      // check available babel options
      root: './src'
    }],
    ['react-native-worklets/plugin', workletsPluginOptions],
  ],
};
