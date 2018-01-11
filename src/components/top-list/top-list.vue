<template>
    <transition name="slide">
        <Music-list :rank="true" :songs="songs" :bgImage="bgImage" :title="title"></Music-list>
    </transition>
</template>
<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getTopListSong } from 'api/rank'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    bgImage() {
      // 把难看的图片换成第一首歌的
      if (this.songs.length) {
        return this.songs[0].image
      }
    },
    title() {
      return this.topList.topTitle
    },
    ...mapGetters(['topList'])
  },
  created() {
    this._getTopListSong()
  },
  methods: {
    _getTopListSong() {
      // 本页面刷新路由back
      if (!this.topList.id) {
        this.$router.back()
      }
      // 从created调用api获取数据
      getTopListSong(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSong(res.songlist)
        }
      })
    },
    // 预处理数据 已经写好的createSong 进行面向对象工厂式
    _normalizeSong(list) {
      let ret = []
      list.forEach(item => {
        let { data } = item
        if (data.albumid && data.songmid) {
          ret.push(createSong(data))
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