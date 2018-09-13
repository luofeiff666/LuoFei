'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)
// nodejs开发框架express，用来简化操作
const express = require('express')
// 创建node.js的express开发框架的实例
const app = express()
// 引入axios
var axios = require('axios')
// 后端代理
var apiRouter = express.Router()
// 挂载
app.use('/api', apiRouter)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: true,
    hot: true,
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll
    },
    // 添加代理请求 before服务启动之前
    before: function(app) {
      // 代理推荐歌单数据
      app.get('/api/getDiscList', function(req, res) {
        // 真实的请求的地址
        var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios
          .get(url, {
            // 修改headers变成和QQ相关的referrer host 欺骗服务器
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            // 把data参数传入
            params: req.query
          })
          // 然后把返回的参数传回给前端
          .then(response => {
            // 把接受到的数据传给浏览器前端
            res.json(response.data)
          })
          .catch(e => {
            console.log(e)
          })
      })
      // 获取歌词
      app.get('/api/getLyric', function(req, res) {
        // 真实的请求的地址
        var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
        axios
          .get(url, {
            // 修改headers变成和QQ相关的referrer host 欺骗服务器
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            // 把data参数传入
            params: req.query
          })
          // 然后把返回的参数传回给前端
          .then(response => {
            // 如果返回的是jsonp需要做处理
            var ret = response.data
            // 转换数据格式转换成json
            if (typeof ret === 'string') {
              var reg = /^\w+\(({[^()]+})\)$/
              var mathes = ret.match(reg)
              if (mathes) {
                // 把转换后的json字符串转换成json
                ret = JSON.parse(mathes[1])
              }
            }
            // 把接受到的数据传给浏览器前端
            res.json(ret)
          })
          .catch(e => {
            console.log(e)
          })
      })
      // 获取歌单歌曲
      app.get('/api/getDiscSong', function(req, res) {
        // 真实的请求的地址
        var url =
          'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

        axios
          .get(url, {
            // 修改headers变成和QQ相关的referrer host 欺骗服务器
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            // 然后把返回的参数传回给前端
            params: req.query
          })
          .then(response => {
            var ret = response.data
            if (typeof ret === 'string') {
              var reg = /^\w+\(({.+})\)$/
              var matches = ret.match(reg)
              if (matches) {
                ret = JSON.parse(matches[1])
              }
              res.json(ret)
            }
          })
          .catch(e => {
            console.log(e)
          })
      })
      // 获取Search
      app.get('/api/getSearch', function(req, res) {
        // 真实的请求的地址
        var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

        axios
          .get(url, {
            // 修改headers变成和QQ相关的referrer host 欺骗服务器
            headers: {
              referer: 'https://c.y.qq.com/',
              host: 'c.y.qq.com'
            },
            // 然后把返回的参数传回给前端
            params: req.query
          })
          .then(response => {
            var ret = response.data
            if (typeof ret === 'string') {
              var reg = /^\w+\(({.+})\)$/
              var matches = ret.match(reg)
              if (matches) {
                ret = JSON.parse(matches[1])
              }
              console.log(ret)
              res.json(ret)
            }
          })
          .catch(e => {
            console.log(e)
          })
      })
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${
                devWebpackConfig.devServer.host
              }:${port}`
            ]
          },
          onErrors: config.dev.notifyOnErrors
            ? utils.createNotifierCallback()
            : undefined
        })
      )

      resolve(devWebpackConfig)
    }
  })
})
