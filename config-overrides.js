const { override, useBabelRc, babelInclude } = require('customize-cra')
const path = require('path')

module.exports = override(
  babelInclude([
    path.resolve('src'), // make sure you link your own source
    // path.resolve('node_modules/react-monaco-editor'),
  ]),
  // addDecoratorsLegacy(),
  useBabelRc(),
  config => {
    // config.plugins.push(new MonacoWebpackPlugin())
    return config
  },
)
