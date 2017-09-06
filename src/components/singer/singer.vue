<template>
  <div class="singer">
    歌手页面
  </div>
</template>

<script type="text/ecmascript-6">
  import {ERR_OK} from 'api/config'
  import {getSingerList} from 'api/singer'

  export default {
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      _getSingerList() {
        console.log(getSingerList())
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            this.singers = res.data.list
            console.log(res.data)
          }
        })
      }
    }
  }

</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .singer
    position: fixed
    top: 0
    bottom: 0
    width: 100%
</style>
