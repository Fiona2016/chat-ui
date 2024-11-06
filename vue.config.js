ifProd = () => process.env.NODE_ENV === 'production'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  lintOnSave: false,
  productionSourceMap: ifProd(),
  outputDir: 'demo/dist',
  assetsDir: 'static',
  publicPath: '/demo/dist/',
  configureWebpack: {
    entry: 'demo/src/main.js',
    resolve: {
      alias: {
        '@/dist': path.resolve(__dirname)
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'demo/public/index.html'),
        filename: 'index.html',
        inject: true
      })
    ]
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
