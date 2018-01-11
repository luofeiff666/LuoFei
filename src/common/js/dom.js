// dom操作的通用代码

// 给DOM对象添加classname
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}
// 判断DOM对象是否已经存在classname
function hasClass(el, className) {
  // 此处正则的规则: 是这个className开头或者是空白字符开头的 或者以空白结尾或以className结尾呢
  // let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  // return reg.test(el.className)
  // 自己修改自己看的清晰的
  let classArray = el.className.split(' ')
  return (
    classArray.findIndex(element => {
      return element === className
    }) !== -1
  )
}

// data-属性操作
export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    // 有data值是获取
    return el.setAttribute(name, val)
  } else {
    // 没有传入data值是取
    return el.getAttribute(name)
  }
}

let elementStyle = document.createElement('div').style

// 浏览器供应商前缀
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (let key in transformNames) {
    // 匹配就返回出去
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  // 都不支持那么是浏览器的问题
  return false
})()

// 处理DOM样式 自动匹配浏览器私有前缀
export function prefixStyle(style) {
  if (vendor === false) return false
  if (vendor === 'standard') return 'standard'
  // 私有前缀 + 样式 首字母并且使之大写 + 样式除首字母外的字符
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
