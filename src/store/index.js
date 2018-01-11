// 入口文件
import Vue from 'vue'
import VueX from 'vuex'
// es6 import 语法规范
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
// 每次在控制台看到VUEX修改
// import createLogger from 'vuex/dist/logger'

Vue.use(VueX)

// 调试工具 在DEV环境下使用 上线去除掉 很消耗性能
// const debug = process.env.NODE_ENV !== 'production'

// export一个实例
export default new VueX.Store({
  actions,
  getters,
  state,
  mutations
  // 用严格模式
  // strict: debug,
  // plugins
  // plugins: debug ? [createLogger()] : []
})
