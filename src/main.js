// 语法转义写在最前面
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import FastClick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'
// vuex
import store from './store'

// 引入css基础样式
import 'common/stylus/index.styl'

/* 优化移动端点击300ms延迟 插件 */
const str = navigator.userAgent.toLowerCase()
const ver = str.match(/cpu iphone os (.*?) like mac os/)
if (!ver) {
  // 非IOS系统
  // 引入fastclick文件
  FastClick.attach(document.body)
} else {
  console.log('你当前的Ios系统版本为：' + ver[1].replace(/_/g, '.'))
  if (parseInt(ver[1]) >= 11) {
    // 不必引入fastclick文件
  } else {
    // 引入fastclick文件
    FastClick.attach(document.body)
  }
}

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
