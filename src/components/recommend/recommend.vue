<template>
<div class="recommend" ref="recommend">
    <!-- 当discList加载完成 那么scroll组件中watch会监听到数据变化进行refresh  -->
    <scroll ref="scroll" :data="discList" class="recommend-content">
        <div>
            <!-- v-if确保了 获取数据created 这个异步过程得到数据后  才开始正确的渲染slot插槽里面的结构不然slider组件里面mounted钩子函数先执行就无法得到正确的DOM -->
            <div v-if="slider.length" class="slider-wrapper">
                <slider>
                    <div v-for="(item ,index) in slider" :key="index">
                        <a :href="item.linkUrl">
                            <!-- scroll组件的派发的click 与监听的fastclick冲突 拦截了click 需要点击可以在点击的元素上添加一个class属性 needsclick 可以是点击生效 -->
                            <img class="needsclick" @load="loadImage" :src="item.picUrl">
                        </a>
                    </div>
                </slider>  
            </div>
            <div class="recommend-list">
                <h1 class="list-title">热门歌单推荐</h1>
                <ul>
                    <li v-for="(item,index) in discList" :key="index" class="item" @click="selectItem(item)">
                        <div class="icon">
                            <img v-lazy="item.imgurl">
                        </div>
                        <div class="text">
                            <span class="name" v-html="item.creator.name"></span>
                            <span class="desc"  v-html="item.dissname"></span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="loading-container" v-show="!discList.length">
            <loading></loading> 
        </div>
    </scroll>
    <router-view></router-view>
</div>
</template>
<script type="text/ecmascript-6">
import Slider from 'base/slider/slider'
import { getRcommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { playlistMixin } from 'common/js/mixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playlistMixin],
  // created钩子在创建实例后立即调用
  created() {
    this._getRcommend()
    this._getDiscList()
  },
  data() {
    return {
      slider: [],
      discList: [],
      clickOne: true
    }
  },
  methods: {
    // 当出现播放器那么就使列表高出底部60px
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '120px' : ''
      // 使得底部高出60ox
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    // 跳转路由 传入点击的元素
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    _getRcommend() {
      getRcommend().then(res => {
        if (res.code === ERR_OK) {
          this.slider = res.data.slider
        }
      })
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          this.discList = res.data.list
        }
      })
    },
    // img上监听load事件使他加载成功后才重新计算 防止歌单加载出来了图片没加载出现高度计算错误
    loadImage() {
      // 标志位 当loadImage加载出第一张后节流 只需重新计算第一张加载后 不需要每张都加载
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.recommend {
    position: fixed;
    width: 100%;
    top: 176px;
    bottom: 0;

    .recommend-content {
        // scroll组件滚动需要设置高度
        height: 100%;
        overflow: hidden;

        .slider-wrapper {
            position: relative;
            width: 100%;
            background-color: #000000;
            overflow: hidden;
        }

        .recommend-list {
            margin-top: 40px;

            .list-title {
                height: 130px;
                line-height: 130px;
                text-align: center;
                font-size: $font-size-medium;
                color: $color-theme;
            }

            .item {
                display: flex;
                box-sizing: border-box;
                align-items: center;
                padding: 0 40px 40px 40px;

                .icon {
                    img {
                        width 120px
                        height 120px
                    }
                    flex: 0 0 120px;
                    width: 120px;
                    padding-right: 40px;
                }

                .text {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    flex: 1;
                    line-height: 40px;
                    overflow: hidden;
                    font-size: $font-size-medium;

                    .name {
                        margin-bottom: 20px;
                        color: $color-text;
                    }

                    .desc {
                        color: $color-text-d;
                    }
                }
            }
        }

        .loading-container {
            position: absolute;
            width: 100%;
            top: 50%;
            transform: translateY(-50%);
        }
    }
}
</style>