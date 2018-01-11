<template>
    <div class="progress-circle">
        <!-- viewBox 可视大小与圆对应 外层的宽高 -->
        <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1"
        xmlns="http://www.w3.org/2000/svg">
        <!-- 内层的圆 半径 坐标 坐标 -->
        <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
        <!-- 外层的圆 stroke-dasharray描边距离范围 圆的周长  stroke-dashoffset描边偏移 -->
        <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashoffset"/>
        </svg>
        <slot></slot>
    </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    // 半径
    radius: {
      type: Number,
      default: 50
    },
    // 百分比
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 周长
      dashArray: Math.PI * 100
    }
  },
  computed: {
    dashoffset() {
      return (1 - this.percent) * this.dashArray
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.progress-circle {
    position: relative;

    circle {
        // 描边的宽度
        stroke-width: 8px;
        transform-origin: center;

        &.progress-background {
            transform: scale(0.9);
            stroke: $color-theme-d;
        }

        &.progress-bar {
            // rotate(-90deg)是让它从顶点开始转
            transform: scale(0.9) rotate(-90deg);
            stroke: $color-sub-theme;
        }
    }
}
</style>