<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    // 初始数据
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      data: {
        type: Array,
        default: null
      },
      listenScroll: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      // 初始化
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll && this.scroll.disable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      // 锚点
      scrollTo() {
        // 参数是个数组 用apply最佳
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      // 对应的位置第一级数组显示
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }

    },
    // 监视数据变化
    watch: {
      // 数据动了就重新获取数据初始化
      data() {
        setTimeout(() => {
          this._initScroll()
        }, 20)
      }
    }
  }
</script>

<style>
</style>
