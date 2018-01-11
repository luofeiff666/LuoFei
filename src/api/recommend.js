import jsonp from 'common/js/jsonp.js'
import { commonParams, options } from './config'
import axios from 'axios'

export function getRcommend() {
  const url =
    'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  // Object.assign 方法只会拷贝源对象自身的并且可枚举的属性到目标对象
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getDiscList() {
  const url = '/api/getDiscList'

  const data = Object.assign({}, commonParams, {
    picmid: 1,
    // 随机数
    rnd: Math.random(),
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29,
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

export function getDiscSongList(disstid) {
  const url = '/api/getDiscSong'

  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    g_tk: 5381,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
