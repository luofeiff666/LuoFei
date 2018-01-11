<template>
<div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
        <div class="progress" ref="progress"></div>
        <div class="progress-btn-wrapper" ref="progressBtn"
            @touchstart.prevent="progressTouchStart"
            @touchmove.prevent="progressTouchMove"
            @touchend="progressTouchEnd"
        >
            <div class="progress-btn" @click.stop></div>
        </div>
    </div>
</div>
</template>
<script type="text/ecmascript-6">
import { prefixStyle } from 'common/js/dom'
// 写好的按钮固定宽度
const progressBtnWidth = 16
const transform = prefixStyle('transform')
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    // 在不同的回调函数中共享一些数据 挂载一个对象
    this.touch = {}
  },
  methods: {
    // 移动开始之前
    progressTouchStart(e) {
      // 设置个标志 表示初始化
      this.touch.initiated = true
      // 记录初始X
      this.touch.startX = e.touches[0].pageX
      // 点击时已经播放了的距离
      this.touch.left = this.$refs.progress.clientWidth
    },
    // 移动
    progressTouchMove(e) {
      // 如果touch没有初始化
      if (!this.touch.initiated) return
      // 实时算出移动时贡献的偏移量
      const deltaX = e.touches[0].pageX - this.touch.startX
      // 初始位置+偏移量 最小不能小于0 最大不能大于barWidth
      const offsetWidth = Math.min(
        Math.max(0, this.touch.left + deltaX),
        this.$refs.progressBar.clientWidth - progressBtnWidth
      )
      this._offset(offsetWidth)
    },
    // 移动结束
    progressTouchEnd() {
      // 结束时需要把标志位重置为false
      this.touch.initiated = false
      // 派发一个事件
      this._triggerPercent()
    },
    // 点击时 跳到点击位置播放
    progressClick(e) {
      // 滚动到点击位置
      this._offset(e.offsetX)
      // 派发事件
      this._triggerPercent()
    },
    // 移动结束后需要做之后
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
      // 移动的结束时的移动距离 / 总长度
      const percent = this.$refs.progress.clientWidth / barWidth
      this.$emit('percentChange', percent)
    },
    // 样式/偏移函数
    _offset(width) {
      this.$refs.progress.style.width = `${width}px`
      this.$refs.progressBtn.style[transform] = `translate3d(${width}px,0,0)`
    }
  },
  watch: {
    percent(newPercent) {
      // 百分比大于0 并且没有拖动的时候 拖动权限最大
      if (newPercent >= 0 && !this.touch.initiated) {
        // 总宽度
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        // 偏移宽度 歌词的播放的比例乘以总高度
        const offsetWidth = newPercent * barWidth
        this._offset(offsetWidth)
      }
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.progress-bar {
    height: 30px;

    .bar-inner {
        position: relative;
        top: 13px;
        height: 4px;
        background: rgba(0, 0, 0, 0.3);

        .progress {
            position: absolute;
            height: 100%;
            background: $color-sub-theme;
        }

        .progress-btn-wrapper {
            position: absolute;
            left: -8px;
            top: -13px;
            width: 30px;
            height: 30px;

            .progress-btn {
                position: relative;
                top: 7px;
                left: 7px;
                box-sizing: border-box;
                width: 16px;
                height: 16px;
                border: 3px solid $color-text;
                border-radius: 50%;
                background: $color-sub-theme;
            }
        }
    }
}
</style>