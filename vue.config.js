/* eslint-disable */
const fs = require('fs')

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: fs.readFileSync('src/assets/scss/variables.scss', 'utf-8')
      }
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  },
  devServer: {
    port: 8080
  },
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/HomebrewCreator/'
    : '/'
}
/* eslint-enable */
