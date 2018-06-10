<template>
<div class="singer" ref="singer">
  <!-- listview派发的点击事件 传递了item -->
  <listview @select="selectSinger" :data="singer" ref="list"></listview>
  <router-view></router-view>
</div>
</template>
<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import Listview from 'base/listview/listview'
// vuex 语法糖mapMutations 方便使用
import { mapMutations } from 'vuex'
import { playlistMixin } from 'common/js/mixin'

const HOT_NAME = '热门'
// 热门歌手个数
const HOT_SINGER_LEN = 10
export default {
  mixins: [playlistMixin],
  data() {
    return {
      singer: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    // 当出现播放器那么就使列表高出底部60px
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '120px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    // 点击listview里面的歌手 跳转路由
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      // 把歌手数据提交进vuex 任何组件可以通过vuex的getters取得singer数据
      this.setSinger(singer)
    },
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singer = this._normallizeSinger(res.data.list)
        }
      })
    },
    // 规范格式化 数据格式
    _normallizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }

      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          )
        }
        // 聚类处理 把首字母相同的归类到同级数组
        // 每次遍历到元素确定key
        const key = item.Findex
        // map对象里面没有那么就建立个map.key
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        // map.key 把相同key的值push进 进行归类
        map[key].items.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })
        )
      })
      //  处理map 得到有序列表
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        // 如果元素的key只是字母
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
          // 如果是热门
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      // 按字母升序
      ret.sort((a, b) => {
        // 字符编码
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    // ... 扩展运算符
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    Listview
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.singer {
  position: fixed;
  top: 176px;
  bottom: 0;
  width: 100%;
}
</style>