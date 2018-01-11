// 使用一个singer类
export default class Singer {
  constructor({ id, name }) {
    // 歌手ID
    this.id = id
    // 歌手名字
    this.name = name
    // 头像图片的src是由固定链接加上Fsinger_mid 拼接的
    this.avatar = `http://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}
