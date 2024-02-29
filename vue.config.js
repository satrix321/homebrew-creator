/* eslint-disable */
const path = require("path");

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/scss/variables.scss";
        `
      }
    }
  },
  configureWebpack: {
    devtool: 'inline-source-map'
  },
  devServer: {
    port: 8080
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/homebrew-creator/'
    : '/'
}
/* eslint-enable */
