<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>
<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
export default {
  props: {
    // 指定组件监听指定事件模式
    probeType: {
      type: Number,
      default: 1
    },
    // 监听派发点击事件
    click: {
      type: Boolean,
      default: true
    },
    // 组件传递的数据 如果是动态变化的需要refresh滚动
    data: {
      type: Array,
      default: null
    },
    // 监听滚动事件
    listenScroll: {
      type: Boolean,
      default: false
    },
    // 是否上拉刷新
    pullup: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll() {
      // 假如没有传入数据那么 停止
      if (!this.$refs.wrapper) return
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      })
      if (this.listenScroll) {
        let me = this
        // 当滚动时派发个事件
        // 回调函数里面的this需要正确指向
        // pos是一个包含XY轴属性的对象
        this.scroll.on('scroll', pos => {
          me.$emit('scroll', pos)
        })
      }
      // 下拉刷新
      if (this.pullup) {
        // 监听scrollEnd
        this.scroll.on('scrollEnd', () => {
          // 滚动到超过底部50的时候
          if (this.scroll.maxScrollY + 50 >= this.scroll.y) {
            // 派发个end时间
            this.$emit('scrollToEnd')
          }
        })
      }
      if (this.beforeScroll) {
        // 滚动之前派发事件
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    // 方法代理
    enable() {
      // 短路操作 存在就调用
      this.scroll && this.scroll.enable()
    },
    disable() {
      this.scroll && this.scroll.disable()
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    },
    // 滚动到
    scrollTo() {
      // apply是因为需要传入参数
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    // 滚动到元素
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    // data变化了重新refresh
    // 设置this.refreshDelay延时是因为有些动画执行需要时间 高度计算不是瞬间完成 有外部需要长时间的那就 单独组件控制
    data() {
      setTimeout(() => {
        this.refresh()
      }, this.refreshDelay)
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>