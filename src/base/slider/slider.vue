<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot></slot>
        </div>
        <div class="dots">
            <!-- :class="active:currnetPageIndex === index 设置currnetPageIndex位置的active样式 -->
            <span class="dot" v-for="(item,index) in dots" :class="{active:currentPageIndex === index}" @click="clickToPage(index)"></span>    
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom.js'
export default {
  data() {
    return {
      children: [],
      dots: [],
      // 记录当前时第几页
      currentPageIndex: 0
    }
  },
  // 暴露出去 让组件外部可控制的接口
  props: {
    // 循环
    loop: {
      type: Boolean,
      default: true
    },
    // 自动轮播循环
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 轮播循环间隔
    interval: {
      type: Number,
      default: 4000
    }
  },
  // el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子
  mounted() {
    // 一般为了保证渲染到DOM 设置个延时 20ms是根据浏览器的刷新时间17ms推的经验所得
    setTimeout(() => {
      this._setSliderWidth()
      // 需要再scroll初始化之前初始化dots
      this._initDots()
      this._initSlider()
      // 判断自动循环
      if (this.autoPlay) {
        this._play()
      }
    }, 20)
    // 监听窗口大小事件 来重新计算slider的宽度
    window.addEventListener('resize', () => {
      // 当没有初始化的时候什么都不做
      if (!this.slider) {
        return
      }
      // 设置个标志位 使得resize改变时不会执行85行代码
      this._setSliderWidth(true)
      // 重新初始化slider
      this.slider.refresh()
    })
  },
  methods: {
    // 设置轮播宽度
    _setSliderWidth(isRsize) {
      // 获得轮播子元素的集合
      this.children = this.$refs.sliderGroup.children
      // group长度
      let width = 0
      // 获取group之外父元素的可视宽度
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]

        // 给每个子元素添加class
        addClass(child, 'slider-item')
        // 设置每个子元素的宽度就是可视宽度
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      // 如果是循环播放 那么就是在当前元素两边个加一个元素 那么相应的宽度随着改变
      if (this.loop && !isRsize) {
        width += 2 * sliderWidth
      }
      // 设置容器sliderGroup的宽度
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    // 初始化dots
    _initDots() {
      // 长度为5的空数组
      this.dots = new Array(this.children.length)
    },
    // 初始化slider
    _initSlider() {
      // 初始化scrcoll
      this.slider = new BScroll(this.$refs.slider, {
        // options配置
        scrollX: true, // 可以横向滚动
        scrollY: false, // 不可纵向滚动
        momentum: false, // 惯性
        snap: true,
        snapLoop: this.loop, // 循环
        snapThreshold: 0.3, //
        snapSpeed: 400// 循环速度
      })
      // 当滚动结束之后
      this.slider.on('scrollEnd', () => {
        // 第几个子元素pageX
        let pageIndex = this.slider.getCurrentPage().pageX
        // 当是循环时 因为默认这个模式时是会添加两边各添加两个元素
        // 循环是从  第二个<-->倒数第二个
        if (this.loop) {
          pageIndex -= 1
        }
        // 设置当前位置
        this.currentPageIndex = pageIndex
        // 滚动结束后结束上一次定时器 并且重新调用_play()
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    // 点击dots跳到相应界面
    clickToPage(index) {
      this.slider.goToPage(index + 1, 0, 400)
      this.currentPageIndex = index
    },
    _play() {
      // 当前位置+1是为了  滚动到下一页
      let nextPageIndex = this.currentPageIndex + 1
      // 当这个情况 代码104行-105行有解释
      if (this.loop) {
        nextPageIndex += 1
      }
      this.timer = setTimeout(() => {
        // scroll 内置的方法 去跳转到目标位置
        // goToPage(X,Y,时间)
        this.slider.goToPage(nextPageIndex, 0, 400)
      }, this.interval)
    }
  },
  // 生命周期结束销毁时 清掉计时器 有利于内存的释放
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.slider {
  min-height: 1px;

  .slider-group {
    position: relative;
    overflow: hidden;
    // 没有空格
    white-space: nowrap;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: $color-text-l;

      // 当时图片对应当前的dota那么改变样式
      &.active {
        width: 20px;
        border-radius: 5px;
        background-color: $color-text-ll;
      }
    }
  }
}
</style>