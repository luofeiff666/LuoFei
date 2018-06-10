<template>
<div class="search">
    <div class="search-box-wrapper">
        <search-box @query="onQueryChange" ref="searcBox"></search-box>
    </div>
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
        <scroll :refreshDelay="refreshDelay" class="shortcut" ref="shortcut" :data="shortcut">
            <div>
                <!-- 热门词 -->
                <div class="hot-key">
                    <h1 class="title">热门搜索</h1>
                    <ul>
                        <li @click="addQuery(item.k)" class="item" v-for="(item, index) in hotKey" :key="index">{{item.k}}</li>
                    </ul>
                </div>
                <!-- 搜索历史 -->
                <div class="search-history" v-show="searchHistory.length">
                    <h1 class="title">
                        <span class="text">搜索历史</span>
                        <span class="clear" @click.stop="showConfirm">
                            <i class="icon-clear"></i>
                        </span>
                    </h1>
                    <search-list
                      @click.stop
                      @select="addQuery"
                      @delete="deleteHistory"   
                      :searches="searchHistory">
                     </search-list>
                </div>
            </div>    
        </scroll>
    </div>
    <!-- 搜索结果 -->
    <div ref="searchResult" class="search-result" v-show="query">
        <suggest ref="suggest" @select='saveSearch' @listScroll="blurInput" :query="query"></suggest>
    </div>
    <!-- confirm弹窗 -->
    <confirm @confirm="confirm" ref="confirm" text="是否清空搜索历史"></confirm>
    <!-- 点击搜索结果的二级路由 -->
    <router-view></router-view>
</div>
</template>
<script type="text/ecmascript-6">
import SearchBox from 'base/search-box/search-box'
import { getHotKey } from 'api/search'
import { ERR_OK } from 'api/config'
import Suggest from 'components/suggest/suggest'
import { mapActions } from 'vuex'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import { playlistMixin, searchMixin } from 'common/js/mixin'
export default {
  mixins: [playlistMixin, searchMixin],
  data() {
    return {
      hotKey: []
    }
  },
  created() {
    this._getHotKey()
  },
  computed: {
    // 传入scroll 的data里面 当这两个值有一个变化那么就重新refresh
    shortcut() {
      return this.hotKey.concat(this.searchHistory)
    }
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '120px' : 0
      this.$refs.shortcutWrapper.style.bottom = bottom
      this.$refs.shortcut.refresh()
      // suggest的refresh是通过组件传递过来的
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.suggest.refresh()
    },
    // 显示确认框
    showConfirm() {
      this.$refs.confirm.show()
    },
    confirm() {
      this.clearHistory()
    },
    // 清空历史
    clearHistory() {
      this.clearSearchHistory()
    },
    deleteHistory(item) {
      // 删除一个历史
      this.deleteSearchHistory(item)
    },
    // 热搜词
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10)
        }
      })
    },

    ...mapActions([
      'clearSearchHistory'
    ])
  },
  watch: {
    // 当query发生变化重新refresh
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh()
        }, 20)
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.search {
  .search-box-wrapper {
    margin: 40px;
  }

  .shortcut-wrapper {
    position: fixed;
    top: 356px;
    bottom: 0;
    width: 100%;

    .shortcut {
      height: 100%;
      overflow: hidden;

      .hot-key {
        margin: 0 40px 40px 40px;

        .title {
          margin-bottom: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;
        }

        .item {
          display: inline-block;
          padding: 10px 20px;
          margin: 0 40px 20px 0;
          border-radius: 12px;
          background: $color-highlight-background;
          font-size: $font-size-medium;
          color: $color-text-d;
        }
      }

      .search-history {
        position: relative;
        margin: 0 40px;

        .title {
          display: flex;
          align-items: center;
          height: 80px;
          font-size: $font-size-medium;
          color: $color-text-l;

          .text {
            flex: 1;
          }

          .clear {
            extend-click();

            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 356px;
    bottom: 0;
  }
}
</style>