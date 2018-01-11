<template>
    <div class="music-list">
        <!-- 返回icon -->
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <!-- 名字 -->
        <h1 class="title" v-html="title"></h1>
        <!-- 背景图片 -->
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <!-- 播放icon -->
            <div class="play-wrapper">
                <div class="play" v-show="playBtn" @click="random">
                    <i class="icon-play"></i>
                    <span class="text">随机播放</span>
                </div>
            </div>
            <!-- 透明度遮罩 -->
            <div class="filter" ref="filter"></div>
        </div>
        <!-- 背景遮罩 辅助遮盖背景 -->
        <div class="bg-layer" ref="layer"></div>
        <!-- 歌单 -->
        <scroll :probeType="probeType" :listenScroll="listenScroll" @scroll="scroll" :data="songs" class="list" ref="list">
            <div class="song-list-wrapper">
                <song-list :rank="rank" @select="selectItem" :songs="songs"></song-list>
            </div>
            <!-- loading -->
            <loading class="loading-container" v-show="!songs.length"></loading> 
        </scroll> 
    </div>
</template>
<script type="text/ecmascript-6">
import SongList from 'base/song-list/song-list'
import Scroll from 'base/scroll/scroll'
import { prefixStyle } from 'common/js/dom'
import Loading from 'base/loading/loading'
import { mapActions } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

// title高度 预留高度
const RESERVED_HEIGHT = 40
// transform 常量来保存
const transform = prefixStyle('transform')
// backdrop 样式
const backdrop = prefixStyle('backdrop-filter')
export default {
  mixins: [playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: []
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0,
      playShow: true
    }
  },
  computed: {
    // 计算出背景图片
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    },
    // 背景图片上的播放按钮满足有数据以及上拉下滑显示隐藏
    // 当有歌曲才显示播放按钮
    playBtn() {
      return this.songs.length > 0 && this.playShow
    }
  },
  // 在创建实例时 一般不需要监听的属性都可以放在created里面
  created() {
    // 这个组件scroll需要监听事件 以及实时的
    this.probeType = 3
    this.listenScroll = true
  },
  mounted() {
    // 设置song-list的top值
    this.$refs.list.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
    // 记录背景图的高度
    this.imageHeight = this.$refs.bgImage.clientHeight
    // 最小滚动距离
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
  },
  methods: {
    // 当出现播放器那么就使列表高出底部60px
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : ''
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    back() {
      this.$router.back()
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      })
    },
    // 随机播放
    random() {
      this.randomPlay({
        list: this.songs
      })
    },
    ...mapActions(['selectPlay', 'randomPlay'])
  },
  watch: {
    scrollY(newVal) {
      // 当newVal小于minTranslateY 那就是不滚动了到了最小限度值
      // 当newVal大于minTranslateY 那就是还没滚动到最小限度 它会随着newVal变化而移动
      let translateY = Math.max(this.minTranslateY, newVal)

      // 性能优化 节流性能
      if (this.translateY === translateY) {
        return
      }
      this.translateY = translateY

      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`

      let zIndex = 0
      // 当滚动到顶部限度 使得图片高度变成title高度
      if (newVal < this.minTranslateY) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        this.playShow = false
      } else {
        // 高度没到那还是默认样式
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.playShow = true
      }

      // 下拉时使得图片放大
      let scale = 1
      // 遮罩层透明度
      let blur = 0
      // 放大百分比 这个percent 会使的放大完全契合拉下高度
      // 下拉的高度比上图片的高度 +1 就是图片需要放大的比例吻合newVal变化
      //  样式里transform-origin: top;使得图片放大方向是从顶部开始
      const percent = Math.abs(newVal / this.imageHeight)
      if (newVal > 0) {
        zIndex = 10
        scale = 1 + percent
      } else {
        // 最小模糊的就20
        blur = Math.min(20 * percent, 20)
      }
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
      // filter是一个透明的遮罩层 在IOS有一个类模糊的效果
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;

    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;

      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;

        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }

  .list {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;

    .song-list-wrapper {
      padding: 20px 30px;
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>.
