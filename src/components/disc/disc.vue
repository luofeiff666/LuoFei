<template>
    <transition name="slide">
        <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
    </transition>
</template>
<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getDiscSongList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapGetters(['disc'])
  },
  created() {
    this._getDiscSongList()
  },
  methods: {
    _getDiscSongList() {
      // 如果在detail页面刷新了 是获取不到数据的ID那么返回到上级路由
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
      }
      getDiscSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSong(res.cdlist[0].songlist)
        }
      })
    },
    // 预处理数据得到想要的数据以及格式
    _normalizeSong(list) {
      let ret = []
      list.forEach(item => {
        // 定义一个key为musicData的对象
        if (item.songid && item.albummid) {
          ret.push(createSong(item))
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

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>