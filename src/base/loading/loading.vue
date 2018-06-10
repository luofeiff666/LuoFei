<template>
    <div class="loading">
        <img src="./loading.gif">
        <P class="desc">{{title}}</P>
    </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: '正在载入中 - - -'
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.loading {
    width: 100%;
    text-align: center;
    img{
        width 48px
        height 48px
    }

    .desc {
        line-height: 40px;
        font-size: $font-size-small;
        color: $color-text-l;
    }
}
</style>