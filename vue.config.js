/* eslint-disable */
const fs = require('fs')

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: fs.readFileSync('src/assets/scss/variables.scss', 'utf-8')
      }
    }
  }
}
/* eslint-enable */
