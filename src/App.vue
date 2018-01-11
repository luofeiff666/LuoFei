<template>
<div id="app">
  <m-header></m-header>
  <tab></tab>
  <!-- keep-alive包裹路由防止每次切换路由都重新获取数据 把数据缓存到内存中 -->
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
  <!-- player组件不是任何路由相关的所以放在app.vue下 -->
  <player></player>
</div>
</template>
<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'

export default {
  components: { MHeader, Tab, Player }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>