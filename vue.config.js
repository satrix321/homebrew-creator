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
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      output: {
        config.output.publicPath = '/PHB_PDF_Generator/';
      }
    } else {
      
    }
  },
  devServer: {
    port: 8080
  }
}
/* eslint-enable */
