<template>
    <transition name="slide">
        <div class="add-song" v-show="showFlag" @click.stop>
            <div class="header">
                <h1 class="title">添加歌曲到列表</h1>
                <div class="close" @click="hide">
                    <i class="icon-close"></i>
                </div>
            </div>
            <div class="search-box-wrapper">
                <search-box ref="searcBox" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
            </div>
            <div class="shortcut" v-show="!query">
                <switches :currentIndex="currentIndex" :switches="switches" @switch="switchItem">
                </switches>
                <div class="list-wrapper">
                    <scroll ref="songList" class="list-scroll" v-if="currentIndex === 0" :data="playHistory">
                        <div class="list-inner">
                            <song-list :songs="playHistory" @select="selectSong"></song-list>
                        </div>
                    </scroll>
                    <scroll :refreshDelay="refreshDelay" ref="searchList" class="list-scroll" v-if="currentIndex === 1">
                            <div class="list-inner">
                                <search-list :searches="searchHistory"
                                @delete="deleteOne"
                                @select="addQuery"
                                >
                                </search-list>
                            </div>
                    </scroll>
                </div> 
            </div>
            <div class="search-result" v-show="query">
                <suggest :query="query" :showSinger="showSinger" @select="selectSuggest" @listScroll="blurInput"></suggest>
            </div>
            <top-tip ref="topTip" :delay="1500">
                <div class="tip-title">
                    <i class="icon-ok"></i>
                    <span class="text">成功添加歌曲到播放队列</span>
                </div>
            </top-tip>
        </div>
    </transition>
</template>
<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import { searchMixin } from 'common/js/mixin'
import Switches from 'base/switches/switches'
import Scroll from 'base/scroll/scroll'
import { mapGetters, mapActions } from 'vuex'
import SongList from 'base/song-list/song-list'
import SearchList from 'base/search-list/search-list'
import { Song } from 'common/js/song'
import TopTip from 'base/top-tip/top-tip'
export default {
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      // 不搜索歌手
      showSinger: false,
      // switches 得数据
      currentIndex: 0,
      switches: [{ name: '最近播放' }, { name: '搜索历史' }]
    }
  },
  computed: {
    ...mapGetters(['playHistory', 'searchHistory'])
  },
  methods: {
    // searchHistory 历史搜索的外派事件
    deleteOne(item) {
      this.deleteSearchHistory(item)
    },
    // selectSong 点击songlist歌曲派发的事件
    selectSong(song, index) {
      if (index !== 0) {
        // 调用actions的插入一首歌
        // 这里不能直接传入song 这是history的一个对象 所以需要创建Song的实例一个
        this.insertSong(new Song(song))
        this.showTopTip()
      }
    },
    // switch 组件派发事件
    // 点击切换
    switchItem(index) {
      this.currentIndex = index
    },
    show() {
      this.showFlag = true
      // 有v-if 需要show的时候重新手动refresh
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh()
        } else {
          this.$refs.searchList.refresh()
        }
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    // 在搜索结果中把点击歌曲插入播放队列
    selectSuggest(query) {
      this.saveSearch(query)
      this.showTopTip()
    },
    // showTopTip 顶部提示
    showTopTip() {
      this.$refs.topTip.show()
    },
    ...mapActions(['insertSong'])
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    TopTip
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.add-song {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 200;
    background: $color-background;

    &.slide-enter-active, &.slide-leave-active {
        transition: all 0.3s;
    }

    &.slide-enter, &.slide-leave-to {
        transform: translate3d(100%, 0, 0);
    }

    .header {
        position: relative;
        height: 44px;
        text-align: center;

        .title {
            line-height: 44px;
            font-size: $font-size-large;
            color: $color-text;
        }

        .close {
            position: absolute;
            top: 0;
            right: 8px;

            .icon-close {
                display: block;
                padding: 12px;
                font-size: 20px;
                color: $color-theme;
            }
        }
    }

    .search-box-wrapper {
        margin: 20px;
    }

    .shortcut {
        .list-wrapper {
            position: absolute;
            top: 165px;
            bottom: 0;
            width: 100%;

            .list-scroll {
                height: 100%;
                overflow: hidden;

                .list-inner {
                    padding: 20px 30px;
                }
            }
        }
    }

    .search-result {
        position: fixed;
        top: 124px;
        bottom: 0;
        width: 100%;
    }

    .tip-title {
        text-align: center;
        padding: 18px 0;
        font-size: 0;

        .icon-ok {
            font-size: $font-size-medium;
            color: $color-theme;
            margin-right: 4px;
        }

        .text {
            font-size: $font-size-medium;
            color: $color-text;
        }
    }
}
</style>