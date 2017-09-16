<template>
  <!-- ref="listview"对这个的引用 -->
  <scroll class="listview" :data="data" :listenScroll="listenScroll" :probeType="probeType" @scroll="scroll" ref="listview">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <div>
          <h2 class="list-group-title">{{group.title}}</h2>
          <ul>
            <li v-for="item in group.items" class="list-group-item">
              <img class="avatar" v-lazy="item.avatar" />
              <span class="name">{{item.name}}</span>
            </li>
          </ul>
        </div>
      </li>
    </ul>
    <!-- touchstart也是由BScroll封装好的触摸事件 -->
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index ) in shortcutList" class="item" :data-index="index" :class="{'current':currentIndex===index}">
          {{item}}
        </li>
      </ul>
    </div>
    <!-- 置顶title -->
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'
import Loading from 'base/loading/loading'

// 锚点高度 每个元素的高度
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30

export default {
  // 定义个touch是为了两个函数间的通信
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  data() {
    return {
      scrollY: -1,
      // 高亮数据
      currentIndex: 0,
      diff: 0
    }
  },
  // 组件通信
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  // 重新计算数组 获取title的substr A B C 列队
  computed: {
    // 快速入口列表
    shortcutList() {
      return this.data.map((group) => {
        // 把第一个字返回出来 新数组
        return group.title.substr()
      })
    },
    // 置顶fixed
    fixedTitle() {
      // 当下拉滑动的时候 隐藏fixed
      if (this.scrollY > 0) {
        return
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  components: {
    Scroll,
    Loading
  },
  methods: {
    onShortcutTouchStart(e) {
      // 方法封装到DOM.JS里面
      // 获取当前点击元素的index
      let anchorIndex = getData(e.target, 'index')
      // 开始点击触碰时的位置
      let firstTouch = e.touches[0]
      // 获得Y轴的位置
      this.touch.y1 = firstTouch.pageY
      // 一开始触碰的index
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      // 当前滑动的Y轴位置
      this.touch.y2 = firstTouch.pageY
      // Y轴上的偏移 向下取整技巧 | 0
      //  当前滑动的位置-第一次记录的位置除以元素高度 滑动小18就是0 大了就看是多少个18 结果就是跨了几个位置
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      // 开始触碰的位置+上跨越的位置就是移动后的位置
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      // 调用滑动动画
      this._scrollTo(anchorIndex)
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    _scrollTo(index) {
      // 侧导航条边界处理 空白区域点击
      if (!index && index !== 0) {
        return
      }
      // 侧导航条边界处理  滑动index小于0 以及大于总数的时候的处理
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      // 获取位置
      this.scrollY = -this.listHeight[index]
      // 滚动动画事件 0 表示无动画时间
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      // 每个元素的高度
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    // 滑动listGroup判断侧边栏的index位置
    scrollY(newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部，newY>0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部，且-newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      // 偏移动画
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  }
}

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>