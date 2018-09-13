var express = require('express')
var config = require('./config/index')
var compression = require('compression')

// 创建node.js的express开发框架的实例
const app = express()
// 引入axios
var axios = require('axios')
// 后端代理
var apiRouter = express.Router()
// 挂载
app.use('/api', apiRouter)
// 代理推荐歌单数据
apiRouter.get('/getDiscList', function(req, res) {
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
apiRouter.get('/getLyric', function(req, res) {
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
apiRouter.get('/getDiscSong', function(req, res) {
  // 真实的请求的地址
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'

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
apiRouter.get('/getSearch', function(req, res) {
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

// 端口
app.use(express.static('./dist'))

// 服务
var port = process.env.PORT || config.build.port

app.use(compression())
module.exports = app.listen(port, function(err) {
  if (err) {
    console.log(err)
  }
  console.log('Listening at http://music.zhangchaoyea.com:' + port + '\n')
})
