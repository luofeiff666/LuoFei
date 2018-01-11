// 这是配置vuex第二步
// getters 里面都是一些函数state里面的映射 根据state不同的值计算出新的值（当作计算属性）也可以复杂的判断逻辑
// 包装 一把在getters里面对外部操作
// 箭头函数 return 一个state.singer
export const singer = state => state.singer

export const playing = state => state.playing

export const fullScreen = state => state.fullScreen

export const playlist = state => state.playlist

export const sequenceList = state => state.sequenceList

export const mode = state => state.mode

export const currentIndex = state => state.currentIndex

// getters 可以担任计算属性角色
export const currentSong = state => {
  return state.playlist[state.currentIndex] || {}
}

export const disc = state => state.disc

export const topList = state => state.topList

export const searchHistory = state => state.searchHistory

export const playHistory = state => state.playHistory

export const favoriteList = state => state.favoriteList