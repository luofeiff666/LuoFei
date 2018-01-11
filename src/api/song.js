import jsonp from 'common/js/jsonp.js'
import { commonParams } from './config'
import axios from 'axios'
// 获取歌曲URL的vkey
export function getSongUrlVKey(songmid) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const data = Object.assign({}, commonParams, {
    songmid: songmid,
    filename: `C400${songmid}.m4a`,
    uin: 0,
    platform: 'yqq',
    cid: 205361747,
    needNewCode: 0,
    from: 'h5',
    format: 'json',
    loginUin: 0,
    hostUin: 0,
    guid: 8280052380
  })

  return jsonp(url, data, {
    // 这个param 要保持和QQ音乐一致
    param: 'callback',
    prefix: 'jp'
  })
}
export function getLyric(mid) {
  const url = '/api/getLyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    // 当前时间戳
    pcachetime: +new Date(),
    // 随机数
    rnd: Math.random(),
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    // 因为用后端代理了 所以这里不需要jsonp这里format设置 'json'
    format: 'json'
  })
  return axios
    .get(url, {
      // 把data传进 后端代理
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
