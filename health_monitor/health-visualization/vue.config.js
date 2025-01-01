const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
      }),
    ],
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000/',
        changeOrigin: true,
      }
    }
  }
})
