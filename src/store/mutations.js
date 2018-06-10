// 这是配置vuex第四步
// 设置mutation 这里是定义一些这么去修改数据的逻辑
import * as types from './mutation-types'

// 挂载了一些方法
const mutations = {
  // 接受两个参数一个state里面的
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  // 布尔值用flag
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_DISC](state, disc) {
    state.disc = disc
  },
  [types.SET_TOP_LIST](state, topList) {
    state.topList = topList
  },
  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history
  },
  [types.SET_PLAY_HISTORY](state, history) {
    state.playHistory = history
  },
  [types.SET_FAVORITE_LIST](state, list) {
    state.favoriteList = list
  },
  [types.SET_MINI_PLAYER_HEIGHT](state, num) {
    state.miniPlayerheight = num
  }
}

export default mutations
