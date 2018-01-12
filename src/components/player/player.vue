<template>
    <div class="player" v-show="playlist.length > 0">
        <!-- 动画钩子函数 transition上监听事件 -->
        <transition name="normal"
                    @enter="enter"
                    @after-enter="afterEnter"
                    @leave="leave"
                    @after-leave="afterLeave"
                    >
            <!-- 满屏播放器 -->
            <div class="normal-player" v-show="fullScreen">
                <!-- 背景图 -->
                <div class="background">
                  <!-- 铺满 -->
                  <img :src="currentSong.image" width="100%" height="100%">
                </div>
                <!-- 顶部返回按钮 歌名和歌手名  -->
                <div class="top">
                  <div class="back" @click="back">
                    <i class="icon-back"></i>
                  </div>
                  <div ref="cdOff" class="cd-off"></div>
                </div>
                <!-- 唱片 一张歌曲图 -->
                <div class="middle"
                      @touchstart.prevent="middleTouchStart"
                      @touchmove.prevent="middleTouchMove"
                      @touchend="middleTouchEnd">
                    <div class="middle-l" ref="middleL">
                        <div class="cd-wrapper" ref="cdWrapper">
                            <play-cd :currentSong="currentSong" :playing="playing"></play-cd>
                        </div>
                        <div class="singer-title">
                            <h1 class="title" v-html="currentSong.name"></h1>
                            <h2 class="subtitle" v-html="currentSong.singer"></h2>
                        </div>
                        <div class="playing-lyric-wrapper">
                            <div class="playing-lyric">{{playingLyric}}</div>
                        </div>
                    </div>
                    <!-- 歌词 -->
                    <scroll @click.stop class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                        <div class="lyric-wrapper">
                          <div v-if="currentLyric">
                            <p ref="lyricLine"
                               class="text"
                               :class="{'current': currentLineNum ===index}"
                               v-for="(line,index) in currentLyric.lines">{{line.txt}}</p>
                          </div>
                        </div>
                    </scroll>
                </div>
                
                <!-- 操作区 -->
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot" :class="{'active':currentShow === 'cd'}"></span>    
                        <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>    
                    </div>
                    <!-- 进度条 -->
                    <div class="progress-wrapper">
                        <span class="time time-l">{{format(currentTime)}}</span>
                        <div class="progress-bar-wrapper">
                            <progress-bar @percentChange="onPercentBarChange" :percent="percent"></progress-bar>    
                        </div>
                        <span class="time time-r">{{format(currentSong.duration)}}</span>    
                    </div>
                    <div class="operators">
                    <!-- 播放模式icon -->
                    <div class="icon i-left" @click="changeMode">
                        <i :class="iconMode"></i>
                    </div>
                    <!-- 播放上一首icon -->
                    <div class="icon i-left" :class="disableCls">
                        <i @click="prev" class="icon-prev" ></i>
                    </div>
                    <!-- 播放暂停icon -->
                    <div class="icon i-center" :class="disableCls">
                        <i :class="playIcon" @click="togglePlaying"></i>
                    </div>
                    <!-- 播放下一首icon -->
                    <div class="icon i-right" :class="disableCls">
                        <i @click="next" class="icon-next"></i>
                    </div>
                    <!-- 喜好收藏 -->
                    <div class="icon i-right">
                        <i @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
                    </div>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="mini">
            <!-- mini播放器 -->
            <div class="mini-player" v-show="!fullScreen" @click="open">
                <div class="icon">
                    <div class="imgWrapper">
                         <img :class="cdCls" width="40" height="40" :src="currentSong.image">
                    </div>     
                </div>
                <div class="text">
                    <h2 class="name" v-html="currentSong.name
                    "></h2>
                    <p class="desc" v-html="currentSong.singer
                    "></p>
                </div>
                <div class="control">
                    <progress-circle :percent="percent" :radius="radius">
                        <i class="icon-mini" @click.stop="togglePlaying" :class="miniIcon"></i>
                    </progress-circle>
                </div>
                <!-- playlist -->
                <div class="control">
                    <i class="icon-playlist" @click.stop="showPlayList"></i>
                </div>
            </div>
        </transition>
        <playlist ref="playlist"></playlist> 
        <!-- 当可以播放歌曲会ready 监听这歌事件 -->
        <audio :src="playUrl" ref="audio" @play="ready" @error="error" @timeupdate="updateTime" @ended="end">
        </audio>
    </div>
</template>
<script type="text/ecmascript-6">
import { mapGetters, mapMutations, mapActions } from 'vuex'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
import Playlist from 'components/playlist/playlist'
import { playMode } from 'common/js/config'
import { playerMixin } from 'common/js/mixin'
import PlayCd from 'base/play-cd/play-cd'

const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
  mixins: [playerMixin],
  data() {
    return {
      songReady: false,
      // 保存当前时间
      currentTime: 0,
      radius: 32,
      playUrl: '',
      currentLyric: null,
      // 当前歌词所在行
      currentLineNum: 0,
      // 维护当前页面的dot
      currentShow: 'cd',
      playingLyric: '',
      clickOne: true
    }
  },
  computed: {
    cdCls() {
      return this.playing ? 'play' : 'play pause'
    },
    // 当前播放时间和歌曲的总时间百分比
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    // 播放class样式
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    // ready没有就绪时
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    ...mapGetters(['fullScreen', 'playing'])
  },
  created() {
    this.touch = {}
    // 伪装人为触发play() 移动端的自动播放限制
    document.addEventListener(
      'click',
      () => {
        if (!this.clickOne) return
        this.$refs.audio.play()
        this.clickOne = false
      },
      false
    )
  },
  methods: {
    // 点击显示playlist
    showPlayList() {
      this.$refs.playlist.show()
    },
    // 滑动cd与歌词界面的切换
    middleTouchStart(e) {
      // 标志位
      this.touch.initiated = true
      // 用来判断是否是一次移动
      this.touch.moved = false
      const touch = e.touches[0]
      // 开始的坐标
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) return
      const touch = e.touches[0]
      // 实时偏移
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      // 由于存在scroll 当滚动歌词Y轴偏移大于X轴偏移那么不做切换 那就是确实在滚动歌词
      if (Math.abs(deltaY) > Math.abs(deltaX)) return
      // 这个事件move发生了这个逻辑才会执行 保证点击start不会直接到end
      if (!this.touch.moved) {
        this.touch.moved = true
      }
      // 距左边宽度 cd页面时就是0 歌词页面时就是可视区宽度
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      // 宽度最大值(负数) 不能超过零 滑动的距离
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + deltaX)
      )
      // 引用的时vue组件 所以需要$el访问到元素
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
      // 滑动的宽度占屏百分比
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.cdOff.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    // 决定停在的位置
    middleTouchEnd() {
      // 这个标志位需要提前判断
      if (!this.touch.moved) {
        return
      }
      let offsetWidth
      let opacity
      // cd模式下 那么就是从右向左滑动
      if (this.currentShow === 'cd') {
        // 超过10% 就划过去
        if (this.touch.percent > 0.1) {
          opacity = 0
          offsetWidth = -window.innerWidth
          this.currentShow = 'lyric'
        } else {
          opacity = 1
          // 没有超过10% 就还原到之前位置
          offsetWidth = 0
        }
      } else {
        // 从左向右
        if (this.touch.percent < 0.9) {
          opacity = 1
          offsetWidth = 0
          this.currentShow = 'cd'
        } else {
          opacity = 0
          offsetWidth = -window.innerWidth
        }
      }
      const time = 400
      this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.cdOff.style.opacity = opacity
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.touch.initiated = false
    },

    // audio播放完毕会派发个ended事件
    end() {
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    // 实现是播放时间从头开始播放
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      // 单曲循环时
      if (this.currentLyric) {
        // 歌词需要重置到开始
        this.currentLyric.seek(0)
      }
    },
    // 点击back打开mini播放
    back() {
      // 需要mutations里面设置 类似方法调用的语法糖
      this.setFullScreen(false)
    },
    // 点击mini空白区域打开全屏播放
    open() {
      this.setFullScreen(true)
    },
    // 播放切换
    togglePlaying() {
      if (!this.songReady) {
        return
      }
      // 暂停歌词时需要切换暂停歌词
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    prev() {
      if (!this.songReady) {
        return
      }
      // 当只有一首歌
      if (this.playlist.length === 1) {
        // 调用单曲循环  不能设置index为0
        // index 0 currentSong 不变 后面的逻辑都不执行
        this.loop()
        return
      } else {
        let index = this.currentIndex - 1
        // 当到达最后一首歌
        if (index === -1) {
          // 循环到第一首歌
          index = this.playlist.length - 1
        }
        this.setCurrentIndex(index)
        // 不需要做播放时判断 因为currentIndex变换currentSong变化 就会触发watch 使audio播放 但是vuex里面的播放状态还未发生改变 样式也不会改变 所以需要调用togglePlaying设置播放状态
        // 暂停时 切换播放状态
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    next() {
      if (!this.songReady) {
        return
      }
      // 当只有一首歌
      if (this.playlist.length === 1) {
        // 调用单曲循环  不能设置index为0
        // index 0 currentSong 不变 后面的逻辑都不执行
        this.loop()
        // 调用loop后直接return 防止一首歌的时候切换歌曲会导致按钮失效
        return
      } else {
        let index = this.currentIndex + 1
        // 当到达最后一首歌
        if (index === this.playlist.length) {
          // 循环到最后首歌
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
      }
      this.songReady = false
    },
    // 预防快速点击 等待歌曲加载完毕才触发这个事件改变标志位状态
    ready() {
      // 标志位
      this.songReady = true
      // 存入播放历史
      this.savePlayHistory(this.currentSong)
    },
    // 防止无法加载到歌曲ready无法就绪 那么标志位永远不会执行
    // 那么上下切换歌曲函数执行不下去功能失效 所以出现error时也要去设置标志位让播放功能正常化
    error() {
      this.songReady = true
    },
    onPercentBarChange(percent) {
      // 进度
      const currentTime = percent * this.currentSong.duration
      this.$refs.audio.currentTime = currentTime
      // 暂停时 切换播放状态
      if (!this.playing) {
        this.togglePlaying()
      }
      // 歌词跟着进度条转跳
      if (this.currentLyric) {
        // 设置歌词进度
        this.currentLyric.seek(currentTime * 1000)
      }
    },
    // audio在播放时派发的一个当前播放时间 也可以设置这个时间来控制播放
    updateTime(e) {
      this.currentTime = e.target.currentTime
    },
    // 把时间转化成分和秒
    format(interval) {
      // 向下取整
      interval = interval | 0
      const minute = this._pad((interval / 60) | 0)
      const second = this._pad((interval % 60) | 0)
      return `${minute}:${second}`
    },
    // 获得url
    getSongUrlVKey() {
      this.currentSong.getSongUrlVKey().then(url => {
        this.playUrl = url
      })
    },
    // 获得歌词
    getLyric() {
      this.currentSong
        .getLyric()
        .then(lyric => {
          // 歌词显示获取需要vuex里面的歌词已经获得改变了 才获取新的歌词
          if (this.currentSong.lyric !== lyric) return
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
          // 没有歌词时
          if (this.currentLyric.lines.length === 0) {
            this.currentLyric = null
            this.playingLyric = '此歌曲为没有填词的纯音乐，请您欣赏'
          }
        })
        .catch(() => {
          // 数据异常时清理歌词
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
    },
    // 当每行歌词结束 都有个回调
    handleLyric({ lineNum, txt }) {
      // 把位置传给class设置这行的样式
      this.currentLineNum = lineNum
      // 当前播放的歌词超过5行那么需要动
      if (lineNum > 5) {
        // 滚动到的元素 从5-5第一个开始上滚 6-5  ...
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList.scrollToElement(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    // 补位函数
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    // 动画钩子函数
    enter(el, done) {
      // 先需要获取mini的cdImage位置 获取大的cd Image位置
      const { x, y, scale } = this._getPosAndScale()
      // 设置动画步骤 需要从x, y 开始运动
      let animation = {
        // 0%时
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        // 位置到了 继续放大 弹性
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        // 还原到位置
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }
      // 注册create-keyframe-animation
      animations.registerAnimation({
        name: 'move',
        animation,
        // 动画间隔
        presets: {
          duration: 400,
          // 线性运动
          easing: 'linear'
        }
      })
      // 运行create-keyframe-animation
      // 参数 运动元素的引用  动画名称 做完动画后的回调(下一步)
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      // 完成动画后unregister
      animations.unregisterAnimation({
        name: 'move'
      })
      // 重置cdWrapper上的animation为空
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      // 这里动画只用两个步骤所以不用create-keyframe-animation辅助
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const { x, y, scale } = this._getPosAndScale()
      // 运动到x, y位置
      this.$refs.cdWrapper.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`
      // 监听transitionend事件执行回调函数done(下一步)
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },

    // 获取初始位置以及放缩尺寸
    _getPosAndScale() {
      // miniCD的宽度
      const targetWidth = 40
      // miniCD中心距离左边的宽度
      const paddingLeft = 40
      //  miniCD中心距离底部的高度
      const paddingBottom = 30
      // 大的CD中心距离顶部的高度
      const paddingTop = 80
      // 大的CD的宽度
      const width = window.innerWidth * 0.8
      // 放缩比例
      const scale = targetWidth / width
      // 需要运动的X轴= 大的CD中心距离两边的宽度 减去 mini距离左边的宽度
      const x = -(window.innerWidth / 2 - paddingLeft)
      // 需要运动的Y轴=
      // 视窗高度减去mini中心距离底部高度减去大CD到顶部的高度再减去2分之1的大CD高度即半径
      const y = window.innerHeight - paddingBottom - paddingTop - width / 2
      return { x, y, scale }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN'
    }),
    ...mapActions(['savePlayHistory'])
  },
  watch: {
    // 当更新currentSong就触发播放
    currentSong(newSong, oldSong) {
      // 当新的歌曲和上次播放的歌曲是同一个那么不做动作 不去更新url
      // 当没有新歌了直接返回
      if (!newSong.id) return
      if (newSong.id === oldSong.id) return
      this.getSongUrlVKey()
      // 每次获取歌词之前 如果存在这个歌词实例 那么先清除掉
      // 歌词依赖内部是存在计时器的 新的歌词需要清除
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
    },
    playUrl() {
      // url加载了才去播放
      // DOM请求SRC之后才能触发play 不然会报错
      this.$nextTick(() => {
        this.$refs.audio.play()
        this.getLyric()
      })
      // 1000ms是考虑到收集播放切到后台到前台js能执行
    },
    playing(newPlaying) {
      // url还没好就不加载
      if (!this.playUrl) return
      // 做个变量保存不用每次playing变化去重新获取DOM
      const audio = this.$refs.audio
      // SET_PLAYING_STATE发生变化 就会触发watch
      this.$nextTick(() => {
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist,
    PlayCd
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;
      z-index: 40 

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .cd-off {
        position: absolute;
        top: -5px;
        left: 50%;
        width: 25%;
        height: 200px;
        z-index: 40;
        background: url('disc-off.png') no-repeat;
        background-size: contain;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 40px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
        }

        .singer-title {
          width: 80%;
          margin: 10px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .title {
            width: 70%;
            margin: 0 auto;
            line-height: 30px;
            text-align: center;
            no-wrap();
            font-size: $font-size-large;
            color: $color-text-ll;
          }

          .subtitle {
            line-height: 20px;
            text-align: center;
            font-size: $font-size-medium;
            color: $color-text-ll;
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 5px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }

          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 15px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 5px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
            margin-right: 10px;
          }

          &.time-r {
            text-align: right;
            margin-left: 10px;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;

      .imgWrapper {
        height: 100%;
        width: 100%;

        img {
          border-radius: 50%;

          &.play {
            animation: rotate 10s linear infinite;
          }

          &.pause {
            animation-play-state: paused;
          }
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
