<template>
    <scroll ref="listview" 
    class="listview" 
    :data="data" 
    :listenScroll="listenScroll"
    @scroll="scroll"
    :probeType="probeType"
    >
        <ul>
            <li v-for="group in data" class="list-group" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li @click="selectItem(item)" class="list-group-item" v-for="item in group.items">
                        <img class="avatar" v-lazy="item.avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="onShortcutTouchStart"
        @touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <!-- 获取index -->
                <li class="item" v-for="(item, index) in shortcutList" :data-index="index"
                :class="{'current':currentIndex === index}">
                    {{item}}
                </li>
            </ul>
        </div>
        <div ref="fixed" class="list-fixed" v-show="fixedTitle">
            <h1 class="fixed-title">{{fixedTitle}}</h1>
        </div>
        <div class="loading-container" v-show="!data.length">
            <loading></loading> 
        </div>
    </scroll>
</template>
<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom'
import Loading from 'base/loading/loading'
// CSS里面写好的 取来的常量
// 锚点高度
const ANCHOR_HEIGHT = 18
// title高度
const TITLE_HEIGHT = 30
export default {
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    // 当probeType为3 那么可以监听到实时滚动
    this.probeType = 3
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      // 当下一个区块滚动到即将到上限减去一个title高度的位置 作为list-fixed判断往上顶的判断
      diff: -1
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  // 计算属性
  computed: {
    // 快速入口列表数据
    shortcutList() {
      return this.data.map(group => {
        // 取得title第一个字符
        return group.title.substr(0, 1)
      })
    },
    // 计算当前位置区块的索引的title
    fixedTitle() {
      // 下拉时 固定title不显示
      if (this.scrollY > 0) {
        return ''
      }
      // data数据的title
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : ''
    }
  },
  methods: {
    // 暴露一个refresh的出口
    refresh() {
      this.$refs.listview.refresh()
    },
    // 派发事件
    selectItem(item) {
      this.$emit('select', item)
    },
    // 监听touch事件
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, 'index')
      // 记录是第几个锚点
      this.touch.anchorIndex = anchorIndex
      // 记录开始位置
      let firstTouch = e.touches[0]
      // 第一次触碰的pageY
      this.touch.y1 = firstTouch.pageY
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0]
      // 滑动实时的pageY
      this.touch.y2 = firstTouch.pageY
      // 计算出Y轴偏移量 移了几个锚点 锚点样式是18px高度
      // |0 相当于向下取整
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0
      // 最开始触碰时取得的锚点+偏移量(滑过了几个锚点)
      // 数值转换进行计算
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    // 观测scrollY
    scroll(pos) {
      this.scrollY = pos.y
    },
    // 滚动到
    _scrollTo(index) {
      // 点击父元素上下空白区域获取不到index
      if (!index && index !== 0) return
      // touchmove父元素上下空白区域index 要么<0 要么超出index 这里做个边界处理
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      // 传入index 使得scroll变化得到newY 那么newY在watch里得到currentIndex变化 使样式发生改变
      // listHeight在data传进来就以及初始化了
      this.scrollY = -this.listHeight[index]
      // scrollToElement(位置, 动画时间(这里瞬间到达))
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    // 获得歌手列表每个区块高度的集合
    _calculateHeiht() {
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        // 每个高度的数据集合 第一个是零其他的每个item高度都是累加前面的
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    // 当传入的data数据监听到变化获取每个区块的高度
    data() {
      setTimeout(() => {
        this._calculateHeiht()
      }, 20)
    },
    // 当scrollY发生变法 获取歌手列表区块在可视区的位置  这个index给侧边栏样式设置使用current
    scrollY(newY) {
      const listHeight = this.listHeight
      // 当滚动下拉 newY > 0 的情况 向上滑动都是小于0
      if (newY > 0) {
        // 保持位置不变还是0
        this.currentIndex = 0
        return
      }

      // 每次滑动都会完成所有循环 总循环只要上线就行比总体数量少1个
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]

        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          // 在scrollY变化取得diff
          this.diff = height2 + newY
          return
        }
      }
      // 当滚动到底部 且-newY大于最后一个元素上限
      this.currentIndex = listHeight.length - 2
    },
    diff(newVal) {
      // diff的newVal大于零
      // 小于title高度 那么就取减去title高度 大于title高度那么就偏移量0 就是会还原到初始位置并不做动画
      // 得到了动画偏移量
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0
      // 性能优化 当this.fixedTop为0时的限制 不执行下面代码不做动画
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      // 上顶动画
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      // 里面子元素居中
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      // 图片样式
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      // 名字
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  // 快速入口时一个 相对定位靠右 需要设置层级
  .list-shortcut {
    position: absolute;
    z-index: 30;
    // 靠右
    right: 0;
    // 垂直居中
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    // 
    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      // .currentIndex的样式变化
      &.current {
        color: $color-theme;
      }
    }
  }

  // 固定title 相对定位
  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  // loading容器
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>