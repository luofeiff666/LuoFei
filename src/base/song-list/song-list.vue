<template>
    <div class="song-list">
        <ul>
            <li class="item" v-for="(song, index) in songs" 
            @click="selectItem(song, index)" :key="index">
                <div class="rank" v-show="rank">
                  <span :class="getRankCls(index)">{{getRankText(index)}}</span>  
                </div>
                <div class="content">
                    <h2 class="name">{{song.name}}</h2>
                    <p class="desc">{{getDesc(song)}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script type="text/ecmascript-6">
export default {
  props: {
    songs: {
      type: Array,
      default: []
    },
    // 控制是否显示排行
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 设置class 对应icon的&
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`
      } else {
        return 'text'
      }
    },
    // 设置index
    getRankText(index) {
      if (index > 2) {
        return index + 1
      }
    },
    selectItem(item, index) {
      this.$emit('select', item, index)
    },
    getDesc(song) {
      return `${song.singer} - ${song.album}`
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 128px;
    font-size: $font-size-medium;

    .rank {
      flex: 0 0 50px;
      width: 50px;
      margin-right: 60px;
      text-align: center;

      .icon {
        display: inline-block;
        width: 50px;
        height: 48px;
        background-size: 50px 48px;

        &.icon0 {
          bg-image('first');
        }

        &.icon1 {
          bg-image('second');
        }

        &.icon2 {
          bg-image('third');
        }
      }

      .text {
        color: $color-sub-theme;
        font-size: $font-size-large;
      }
    }

    .content {
      flex: 1;
      line-height: 40px;
      overflow: hidden;

      .name {
        no-wrap();
        color: $color-text;
      }

      .desc {
        no-wrap();
        margin-top: 8px;
        color: $color-text-d;
      }
    }
  }
}
</style>