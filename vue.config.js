ifProd = () => process.env.NODE_ENV === 'production'
const path = require('path')

module.exports = {
  lintOnSave: false,
  productionSourceMap: ifProd(),
  outputDir: 'demo/dist',
  assetsDir: 'static',
  publicPath: '/demo/dist/',
  pages: {
    index: {
      entry: 'demo/src/main.js',
      template: 'demo/public/index.html',
      filename: 'index.html'
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@/dist': path.resolve(__dirname)
      }
    }
  },
  chainWebpack: (config) => {
    // Inline images & svgs into build
    config.module
      .rule('images')
      .use('url-loader')
      .options({
        limit: 4096 * 3
      })
    config.module
      .rule('svg')
      .use('file-loader')
      .loader('url-loader')
      .options({
        limit: 4096 * 3
      })
  },

  css: {
    extract: false
  }
}
