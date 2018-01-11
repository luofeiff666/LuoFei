<template>
    <!-- 路由转跳时过场动画 -->
    <transition name="slide">
        <music-list 
        :songs="songs"
        :title="title"
        :bg-image="bgImage"
         >
         </music-list>
    </transition>
</template>
<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
import MusicList from 'components/music-list/music-list'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    // 得到两个music-list所需的数据
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.avatar
    },
    // 里面是数组 相当于在这个vue实例中挂载了这个属性
    ...mapGetters(['singer'])
  },
  created() {
    this._getDetail()
  },
  methods: {
    _getDetail() {
      // 如果在detail页面刷新了 是获取不到数据的ID那么返回到上级路由
      if (!this.singer.id) {
        this.$router.push('/singer')
        return
      }
      getSingerDetail(this.singer.id).then(res => {
        if (ERR_OK === res.code) {
          this.songs = this._normalizeSong(res.data.list)
        }
      })
    },
    _normalizeSong(list) {
      let ret = []
      list.forEach(item => {
        // 定义一个key为musicData的对象
        let { musicData } = item
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

// 100% 是整体向右移动
.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>