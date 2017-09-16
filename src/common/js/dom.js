// 判断class
export function hasClass(el, className) {
  // classname前后有或没有空白字符都通过test
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

// 给DOM对象添加class
export function addClass(el, className) {
  // 如果有class不再添加
  if (hasClass(el, className)) {
    return
  }
  // 把class的空格拆分开变成数组
  let newClass = el.className.split(' ')
  newClass.push(className)
  // 数组 然后把class 用空白隔开传进去
  el.className = newClass.join(' ')
}

// 获取:data属性的变量
export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  // 如果传入val那么就是设置自定义属性
  if (val) {
    return el.setAttribute(prefix + name, val)
  } else {
    return el.getAttribute(name)
  }
}
