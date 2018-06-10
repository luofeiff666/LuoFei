// 这是配置vuex第一步
// 配置文件 养成这样的习惯
// state里最原始的数据
import { loadSearch, loadPlay, loadFavorite } from 'common/js/cache'
import { playMode } from 'common/js/config.js'
const state = {
  singer: {},
  // 播放
  playing: false,
  // 满屏
  fullScreen: false,
  // 播放列表(随机播放外部修改提交mutation操作-这个数组达到改变的目地)
  playlist: [],
  // 默认顺序列表
  sequenceList: [],
  // 播放模式在js里面定义个语义化的
  mode: playMode.sequence,
  // 歌曲索引
  currentIndex: -1,
  // 歌单对象
  disc: {},
  // 排行榜对象
  topList: {},
  // 搜索历史
  searchHistory: loadSearch(),
  // 播放历史
  playHistory: loadPlay(),
  // 喜欢的收藏列表
  favoriteList: loadFavorite(),
  // mini
  miniPlayerheight: 60
}

export default state
