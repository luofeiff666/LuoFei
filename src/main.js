import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'

// Vue.config.productionTip = false
import 'common/stylus/index.styl'
/* 优化移动端点击300ms延迟 插件 */
fastclick.attach(document.body)

// 懒加载图片
Vue.use(VueLazyLoad, {
  // 加载到图片之前预显示的
  loading: require('common/image/default.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
