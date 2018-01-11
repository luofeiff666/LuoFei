// actions 一般两种操作 对mutation的封装（某个动作需要触发多个mutation） 或对异步的操作
// 所以根据有需要时再去配置
import {
  saveSearch,
  deleteSearch,
  clearSearch,
  savePlay,
  saveFavorite,
  deleteFavorite
} from 'common/js/cache'
import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

export const selectPlay = function({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  // 假如目前正在随机播放 那么点击列表里面的元素需要重新洗牌
  if (state.mode === playMode.random) {
    let randomlist = shuffle(list)
    commit(types.SET_PLAYLIST, randomlist)
    index = findIndex(randomlist, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function({ commit }, { list }) {
  // 改变播放模式
  commit(types.SET_PLAY_MODE, playMode.random)
  // 得到歌曲列表
  commit(types.SET_SEQUENCE_LIST, list)
  let randomlist = shuffle(list)
  // 得到随机播放列表
  commit(types.SET_PLAYLIST, randomlist)
  // 从第一个开始播放
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
// 在当前播放位置插入一首歌
export const insertSong = function({ commit, state }, song) {
  // 引用类型需要创建一个副本才能修改他
  // 不然只能在mutations下修改state
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 检索插入的song在不在playlist并返回索引
  let fpIndex = findIndex(playlist, song)
  // 插入当前之后所以+1
  currentIndex++
  // 插入歌曲到当前索引
  playlist.splice(currentIndex, 0, song)
  // 当包涵时
  if (fpIndex > -1) {
    // 如果当前的插入歌曲大于列表中的序号
    if (currentIndex > fpIndex) {
      // 那么删除当前位置歌曲
      playlist.splice(fpIndex, 1)
      currentIndex--
    } else {
      // 如果插入歌曲小于当前位置 那么直接在找到的位置+1删除相同的
      playlist.splice(fpIndex + 1, 1)
    }
  }
  // 找到当前播放的歌曲在sequenceList的位置 + 1
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  // 找到插入这个首歌在sequenceList 的位置
  let fsIndex = findIndex(sequenceList, song)
  // 插如这首歌
  sequenceList.splice(currentSIndex, 0, song)
  // 判断有没有这首歌
  // 当包涵时
  if (fsIndex > -1) {
    // 如果当前的插入歌曲大于列表中的序号
    if (currentSIndex > fsIndex) {
      // 那么删除当前位置歌曲
      sequenceList.splice(fsIndex, 1)
    } else {
      // 如果插入歌曲小于当前位置 那么直接在找到的位置+1删除相同的
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
// 存储搜索列表
export const saveSearchHistory = function({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}
// 删除搜索
export const deleteSearchHistory = function({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}
// 清空搜索
export const clearSearchHistory = function({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, clearSearch(query))
}

export const deleteSong = function({ commit, state }, song) {
  // 引用类型需要创建一个副本才能修改他
  // 不然只能在mutations下修改state
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playlist.length > 0
  // 假如删完了整个列表 播放状态false
  // 或存在列表的时候   播放状态true
  commit(types.SET_PLAYING_STATE, playingState)
}

// 清空列表
export const deleteSongList = function({ commit }) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}
// 保存播放历史  在audio  ready的时候存入
export const savePlayHistory = function({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}
// 保存收藏
export const saveFavoriteList = function({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}
// 取消收藏
export const deleteFavoriteList = function({ commit }, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
