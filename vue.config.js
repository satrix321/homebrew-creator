/* eslint-disable */
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/assets/scss/variables.scss";`
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
