import jsonp from 'common/js/jsonp.js'
import { commonParams, options } from './config'
import axios from 'axios'

export function getHotKey(w) {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

export function getSearchResult(query, page, zhida, perpage) {
  const url = '/api/getSearch'

  const data = Object.assign({}, commonParams, {
    w: query,
    g_tk: 5381,
    uin: 0,
    notice: 0,
    platform: 'h5',
    needNewCode: 1,
    zhidaqu: 1,
    // 是否搜索歌手
    catZhida: zhida ? 1 : 0,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: perpage,
    n: perpage,
    p: page,
    remoteplace: 'txt.mqq.all'
  })

  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
}
