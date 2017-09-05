<template>
  <!-- 外部引用 ref="slider" -->
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <!-- :class="{ 判断当前的位置是否和currentPageIndex相同 相同就添加active -->
      <span class="dot" v-for="(item,index) in dots" :class="{active:currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'

  export default {
    // 轮播属性设置 的外部接口
    data() {
      return {
        dots: [],
        // 表示当前是第几页 默认0
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      // 自定轮播间隔
      interval: {
        type: Number,
        default: 4000
      }
    },
    // beeter-scroll初始化 渲染时机
    mounted() {
      setTimeout(() => {
        this._setSliderWidth()
        this._initDots()
        this._initSlider()

        // 判断是否自动轮播
        if (this.autoPlay) {
          this._play()
        }
      }, 20)

      // 自动获取屏幕宽度尺寸 响应式
      // 当resize事件触发时 重新获取设置宽度
      window.addEventListener('resize', () => {
        // 如果slider还没有初始化的时候 那么 return
        if (!this.slider) {
          return
        }
        // 问题:这里重新设置    width += 2 * sliderWidth不能再这里再次设置所以要设置一个Boolon- isResize 去判断
        this._setSliderWidth(true)
        // BScroll的一个refresh API 当宽度发生变化重新refresh重新计算
        this.slider.refresh()
      })
    },
    methods: {
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children

        let width = 0
        // 获得当前屏幕的宽度
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')

          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        // 边界处理 边界是添加两倍的宽 保证循环
        // 一开始的时候是需要多算2倍的sliderWidth
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initDots() {
        // 导航个数
        this.dots = new Array(this.children.length)
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          // 允许X轴滚动
          scrollX: true,
          // 不允许Y轴动
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snapThreshold: 0.3,
          // 滑动动画速度
          snapSpeed: 400
          // 这个在移动端会阻止转跳默认事件click 不设置
          // click: true
        })
        // 内置的scrollEnd 滚动完毕触发
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX
          // 做一个判断
          if (this.loop) {
            // 默认配置的时候是+1 这里当滚动的时候 要-1
            pageIndex -= 1
          }
          this.currentPageIndex = pageIndex
          // 每次轮播前 清除前面的定时器
          if (this.autoPlay) {
            clearTimeout(this.timer)
            this._play()
          }
        })
      },
      _play() {
        // this.currentPageIndex默认是0
        let pageIndex = this.currentPageIndex + 1
        if (this.loop) {
          // 如果是可以滑动 轮播那么第一张前面还有一张 所以看到的第一张是index是2
          pageIndex += 1
        }
        this.timer = setTimeout(() => {
          // goToPage是BScroll提供的(位置,Y轴动画时间,X轴动画时间)
          this.slider.goToPage(pageIndex, 0, 400)
        }, this.interval)
      }
    },
    // 组件销毁时清除循环 保持良好习惯 清除内存
    destroyed() {
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slider
    min-height: 1px
    .slider-group
      position relative
      overflow hidden
      white-space nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display block
          width: 100%
      .dots
        position: absolute
        right: 0
        left: 0

    .dots
      position: absolute
      bottom: 12px
      right: 0
      left: 0
      margin-bottom: 5px
      text-align: center
      font-size: 0
      .dot
        display inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
