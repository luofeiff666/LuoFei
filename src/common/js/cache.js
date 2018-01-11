// 这里封装着本地存取相关逻辑
import storage from 'good-storage'

// key的私有语义化
const SEARCH_KEY = '__search__'
// 存储的数据上限
const SEARCH_MAX_LENGTH = 15
// 播放历史的key
const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200
// 喜好收藏
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LENGTH = 200

// 搜索列表
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(
    searches,
    query,
    item => {
      return item === query
    },
    SEARCH_MAX_LENGTH
  )
  // 保存处理好的数组
  storage.set(SEARCH_KEY, searches)
  // 返回出新的数组
  return searches
}

// 实现每次存储都是插在最前面 有相同的去除相同的值
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

// 从本地缓存去读取数据
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

// 删除
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  // 如果传入元素说明是点击到删除一个
  deleteFromArray(searches, item => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

// 从数组中删除
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return storage.get(SEARCH_KEY, [])
}

// 播放列表
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(
    songs,
    song,
    item => {
      return item.id === song.id
    },
    PLAY_MAX_LENGTH
  )
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay(song) {
  return storage.get(PLAY_KEY, [])
}

// 收藏列表
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(
    songs,
    song,
    item => {
      return song.id === item.id
    },
    FAVORITE_MAX_LENGTH
  )
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, item => {
    return song.id === item.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}
