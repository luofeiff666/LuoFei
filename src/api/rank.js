import jsonp from 'common/js/jsonp.js'
import { commonParams, options } from './config'

export function getRankList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    _: 1515202842656,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}
// 排行歌曲
export function getTopListSong(id) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid: id
  })

  return jsonp(url, data, options)
}
