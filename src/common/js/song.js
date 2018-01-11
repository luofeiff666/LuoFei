import { getLyric, getSongUrlVKey } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'
// 面向对象  构造Song的类
export class Song {
  constructor({ id, mid, singer, name, album, duration, image }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
  }
  // 获得url的vkey
  getSongUrlVKey() {
    if (this.url) {
      return Promise.resolve(this.url)
    }
    // 异步操作去请求 获得每个mid的vkey
    return new Promise((resolve, reject) => {
      getSongUrlVKey(this.mid).then(res => {
        if (ERR_OK === res.code) {
          this.url = getUrl(this.mid, res.data.items[0].vkey)
          resolve(this.url)
        }
      })
    })
  }
  // 歌词是Song的一个属性所以在创建类的时候调用
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (ERR_OK === res.retcode) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        }
      })
    })
  }
}

// 工厂方法 处理后获得需要的数据
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    // 专辑
    album: musicData.albumname,
    // 播放时长
    duration: musicData.interval,
    // 固定url拼接上midID
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${
      musicData.albummid
    }.jpg?max_age=2592000`
    // 歌曲地址
  })
}

// 当有两个歌手共同唱的 有两个name 那么把那么遍历出来
// 再用/连接 返回出来字符串
function filterSinger(singer) {
  let ret = []
  if (!singer) return ''
  singer.forEach(s => {
    ret.push(s.name)
  })
  // 如果是只有一个那么join方法 不会添加/
  return ret.join('/')
}

// 获得audiod的url
function getUrl(id, key) {
  return `http://dl.stream.qqmusic.qq.com/C400${id}.m4a?vkey=${key}&guid=8280052380&uin=0&fromtag=66
  `
}
