<template>
    <div class="rank" ref="rank">
        <scroll ref="toplist" :data="topList" class="toplist">
            <ul>
                <li class="item" v-for="(item, index) in topList" @click="selectItem(item)" :key="index">
                    <div class="icon">
                        <img v-lazy="item.picUrl">
                    </div>
                    <ul class="songlist">
                        <li class="song" v-for="(song, index) in item.songList" :key="index">
                            <span>{{index + 1}}</span>
                            <span>{{song.songname}}-{{song.singername}}</span>
                        </li>
                    </ul>  
                </li>
            </ul>
            <div class="loading-container" v-show="!topList">
                <loading></loading>
            </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>
<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import { getRankList } from 'api/rank'
import { ERR_OK } from 'api/config'
import Loading from 'base/loading/loading'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'
export default {
  mixins: [playlistMixin],
  data() {
    return {
      topList: []
    }
  },
  created() {
    this._getRankList()
  },
  methods: {
    // 当出现播放器那么就使列表高出底部60px
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '120px' : ''
      // 使得底部高出60ox
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    // 切换到子路由
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item)
    },
    _getRankList() {
      getRankList().then(res => {
        if (res.code === ERR_OK) {
          this.topList = res.data.topList
        }
      })
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  },
  components: {
    Scroll,
    Loading
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.rank {
  position: fixed;
  width: 100%;
  top: 176px;
  bottom: 0;

  .toplist {
    height: 100%;
    overflow: hidden;

    .item {
      display: flex;
      margin: 0 40px;
      padding-top: 40px;
      height: 200px;

      &:last-child {
        padding-bottom: 40px;
      }

      .icon {
        img {
          width: 200px;
          height: 200px;
        }

        flex: 0 0 200px;
        width: 200px;
        height: 200px;
      }

      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 40px;
        height: 200px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;

        .song {
          no-wrap();
          line-height: 52px;
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>