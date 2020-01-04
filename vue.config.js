/* eslint-disable */
const path = require("path");

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/scss/variables.scss";
          @import "@/assets/scss/mixins.scss";
          @import "@/assets/scss/functions.scss";
        `
      }
    }
  },
  configureWebpack: {
    devtool: 'eval-source-map'
  },
  devServer: {
    port: 8080
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/Homebrew-Creator/'
    : '/'
}
/* eslint-enable */
