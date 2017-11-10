<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!-- keep-alive标签包裹一个不想在生命周期重复获取数据 数据都是缓存在内存中 提升体验 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'

export default {
  name: 'app',
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
