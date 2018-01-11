import originJSONP from 'jsonp'

export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

// 把data拼接到url
function param(data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    // &后面的拼接=两边不能有空格不然会出现304错误
    url += `&${k}=${encodeURIComponent(value)}`
  }
  // 如果url有 那么return出除了第一个字符(&)外剩余字符
  return url ? url.substring(1) : ''
}