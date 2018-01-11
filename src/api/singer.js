import jsonp from 'common/js/jsonp.js'
import { commonParams, options } from './config'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })

  return jsonp(url, data, options)
}

export function getSingerDetail(singerid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParams, {
    singermid: singerid,
    uin: 0,
    platform: 'h5page',
    needNewCode: 1,
    from: 'h5',
    order: 'listen',
    num: 100,
    begin: 0,
    _: 1514800303728
  })

  return jsonp(url, data, options)
}