<template>
<div class="cd" :class="cdCls">
        <div class="cd-group">
             <img class="image-light" src="./disc_light.png">
             <img class="image-cd" :src="currentSong.image">
        </div>
</div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    playing: {
      type: Boolean,
      default: false
    },
    currentSong: {
      type: Object,
      default: {}
    }
  },
  computed: {
    // cd的转动动画
    cdCls() {
      return this.playing ? 'play' : 'play pause'
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.cd {
    width: 100%;
    height: 100%;
    border-radius: 50%;

    .cd-group {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: 50%;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: url('disc-cd.png') no-repeat 50% 50%;
        background-size: contain;

        .image-light {
            width: 100%;
            height: 100%;
        }

        .image-cd {
            position: absolute;
            left: 20%;
            top: 20%;
            width: 60%;
            height: 60%;
            border-radius: 50%;
        }
    }

    &.play {
        animation: rotate 20s linear infinite;
    }

    &.pause {
        animation-play-state: paused;
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