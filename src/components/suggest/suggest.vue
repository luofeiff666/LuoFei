<template>
    <scroll ref="suggest" :pullup="pullup" class="suggest" 
    :data="result"
    :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore"
    @beforeScroll='listScroll'
    >
        <ul class="suggest-list">
            <li class="suggest-item" v-for="(item, index) in result" @click="selectItem(item)" :key="index">
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name" v-html="getDisPlayName(item)">
                    <p class="text"></p>
                </div>
            </li>
            <loading v-show="hasMore" title=""></loading>
        </ul>
        <div class="no-result-wrapper" v-show="!hasMore && !result.length">
            <no-result title="sorry, 没有搜索结果"></no-result>
        </div>
    </scroll>
</template>
<script type="text/ecmascript-6">
import { getSearchResult } from 'api/search'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { mapActions, mapMutations } from 'vuex'
import Singer from 'common/js/singer'
import NoResult from 'base/no-result/no-result'

const TYPE_SINGER = 'singer'
// 一次请求的数量
const perpage = 20
export default {
  data() {
    return {
      result: [],
      page: 1,
      pullup: true,
      // searchMore的标志位
      hasMore: true,
      beforeScroll: true
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    refresh() {
      this.$refs.suggest.refresh()
    },
    selectItem(item) {
      // 如果点击的是歌手那么转到singer-dedail
      if (item.type === TYPE_SINGER) {
        // 点击跳转子路由
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        })
        this.$router.push(`/search/${singer.id}`)
        this.setSinger(singer, 0)
      } else {
        this.insertSong(item)
      }
      // 派发事件出去 进行搜索历史保存
      this.$emit('select')
    },
    // 下拉刷新
    searchMore() {
      if (!this.hasMore) return
      this.page++
      // 再次搜索
      // 不搜索歌手 不能直接设置this.showSinger = false props的属性都必须由父级传进
      getSearchResult(this.query, this.page, false, perpage).then(res => {
        if (res.code === ERR_OK) {
          // 拼接上之前的数据
          this.result = this.result.concat(this._genResult(res.data))
          // 检查是否搜索完毕全部数据
          this._checkMore(res.data)
        }
      })
    },
    // 搜索结果里的数据 根据条件分别设置
    getDisPlayName(item) {
      // 存在歌手的时候
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return item.name + ' - ' + item.singer
      }
    },
    // 结果列表前面的icon 判断是歌手还是歌曲 根据条件分别设置
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    // 搜索结果
    search() {
      // 第一次刷新重新把搜索浏览的位置重置到顶部
      this.page = 1
      this.$refs.suggest.scrollTo(0, 0)
      this.hasMore = true
      getSearchResult(
        this.query,
        this.page,
        this.showSinger,
        perpage
      ).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data)
          // 检查是否搜索完毕全部数据
          this._checkMore(res.data)
        }
      })
    },
    // 派发一个事件
    listScroll() {
      this.$emit('listScroll')
    },
    _checkMore(list) {
      const song = list.song
      // 满足歌曲列表为空  或 页数 * 20 个 大于总数 就设置不可继续搜索标志位
      if (
        !song.list.length ||
        song.curnum + (song.curpage - 1) * perpage >= song.totalnum
      ) {
        this.hasMore = false
      }
    },
    // 得到组件可用的对象
    _normallizeSongs(list) {
      let ret = []
      list.forEach(musicData => {
        if (musicData.songid && musicData.albumid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    // 与处理数据
    _genResult(data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      if (data.song) {
        ret = ret.concat(this._normallizeSongs(data.song.list))
      }
      return ret
    },
    ...mapActions(['insertSong']),
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  watch: {
    query() {
      this.search()
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 60px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 40px;
    }

    .icon {
      flex: 0 0 60px;
      width: 60px;

      [class^='icon-'] {
        font-size: 28px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
