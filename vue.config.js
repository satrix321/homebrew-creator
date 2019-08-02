/* eslint-disable */
const path = require("path");

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/assets/scss/variables.scss";
          @import "@/assets/scss/mixins.scss";
          @import "@/assets/scss/functions.scss";
        `
      }
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  },
  devServer: {
    port: 8080
  },
  outputDir: path.resolve(__dirname, 'docs'),

  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/HomebrewCreator/'
  //   : '/'
}
/* eslint-enable */
