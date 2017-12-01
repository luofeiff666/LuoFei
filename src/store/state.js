import { playMode } from 'common/js/config'
const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  // 播放索引
  currentIndex: -1,
  // 歌单的对象
  disc: {},
  // 排行榜数据
  topList: {}
}

export default state