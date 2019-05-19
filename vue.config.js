/* eslint-disable */
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
  publicPath: process.env.NODE_ENV === 'production'
    ? '/HomebrewCreator/'
    : '/'
}
/* eslint-enable */
