<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!-- keep-alive标签包裹一个不想在生命周期重复获取数据 数据都是缓存在内存中 提升体验 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'

  export default {
    name: 'app',
    components: {
      MHeader,
      Tab
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
