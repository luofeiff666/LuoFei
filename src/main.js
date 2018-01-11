// 语法转义写在最前面
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
// vuex
import store from './store'

// 引入css基础样式
import 'common/stylus/index.styl'

// 用到body上 其上的点击都没有300ms延迟
fastclick.attach(document.body)

// 使用lazy
Vue.use(VueLazyLoad, {
  // 代替图片地址
  loading: require('common/image/default2.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
