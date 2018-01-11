import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'

// 一般用于共享多个组件的方法
export const playlistMixin = {
  computed: {
    ...mapGetters(['playlist'])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(this.playlist)
    }
  },
  methods: {
    handlePlaylist() {
      // 必须在组件中定义这个函数覆盖他 不然就会
      // 抛出异常
      throw new Error('组件必须实现这个帮助函数')
    }
  }
}

export const playerMixin = {
  computed: {
    ...mapGetters([
      'sequenceList',
      'currentIndex',
      'currentSong',
      'mode',
      'playlist',
      'favoriteList'
    ]),
    // 播放模式class
    iconMode() {
      return this.mode === playMode.sequence
        ? 'icon-sequence'
        : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    }
  },
  methods: {
    // 喜好收藏切换
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    // icon切换
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
    // 判断辅助函数
    isFavorite(song) {
      const index = this.favoriteList.findIndex(item => {
        return item.id === song.id
      })
      // 找到就是true 没有就是false
      return index > -1
    },
    // 点击改变播放模式状态
    changeMode() {
      // 假如mode是2 那么2+1 是0  假如mode是1+1 那么是2  假如mode是0+1 那么是1
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      // 修改播放列表
      this.resetCurrentIndex(list)
      this.setPlayList(list)
    },
    // 找到打乱后正在播放歌曲的index
    resetCurrentIndex(list, song) {
      // 在打乱后的列表中找到当前播放歌曲的index
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      // 重新提交index  watch newsong和oldsong都是一样的里面就不会播放新的歌曲
      this.setCurrentIndex(index)
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions(['saveFavoriteList', 'deleteFavoriteList'])
  }
}

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters(['searchHistory'])
  },
  methods: {
    addQuery(k) {
      // 调用search-box的暴露接口
      this.$refs.searcBox.setQuery(k)
    },
    // 搜索结果
    onQueryChange(query) {
      this.query = query
    },
    // 滑动时使得input拾取焦点
    blurInput() {
      this.$refs.searcBox.blur()
    },
    // 保存搜索结果
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    ...mapActions(['saveSearchHistory', 'deleteSearchHistory'])
  }
}
