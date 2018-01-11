<template>
    <transition>
        <div class="playlist" v-show="showFlag" @click.stop="hide">
            <div class="list-wrapper" @click.stop>
                <!-- 标题部分 -->
                <div class="list-header">
                    <h1 class="title">
                        <!-- 播放模式 -->
                        <i class="icon" :class="iconMode" @click="changeMode"></i>
                        <span class="text">{{textMode}}</span>
                        <span class="clear" @click="showConfirm">
                            <i class="icon-clear"></i>
                        </span>
                    </h1>
                </div>
                <!-- 列表部分 -->
                <!-- 动画需要时间 那么单独传refreshDelay控制refresh刷新时间计算高度 同步动画完成 -->
                <scroll :refreshDelay="refreshDelay" ref="listContent" class="list-content" :data="sequenceList">
                    <!-- vue提供了一个列表动画的标签 -->
                    <transition-group ref="list" name="list" tag="ul">
                        <!-- 列表动画需要在li里面定义key属性保证每个元素都不一样 -->
                        <li :key="item.id" @click.stop="selectItem(item,index)" class="item" v-for="(item, index) in sequenceList">
                            <i class="current" :class="getCurrentIcon(item)"></i>
                            <span class="text">{{item.name}}</span>
                            <!-- 喜好收藏 -->
                            <span @click.stop="toggleFavorite(item)" class="like">
                                <i :class="getFavoriteIcon(item)"></i>
                            </span>
                            <span class="delete" @click.stop="deleteOne(item)">
                                <i class="icon-delete"></i>
                            </span>
                        </li>
                    </transition-group>
                </scroll>
                <!-- 底部操作部分 -->
                <div class="list-operate">
                    <div class="add" @click="addSong">
                        <i class="icon-add"></i>
                        <span class="text">添加歌曲到队列</span>
                    </div>
                </div>
                <div @click.stop="hide" class="list-close">
                    <span>关闭</span>    
                </div>
            </div>
            <confirm @confirm="confirmClear" ref="confirm" text="是否清空播放列表"></confirm>
            <add-song ref="addSong"></add-song>
        </div>
    </transition>
</template>
<script type="text/ecmascript-6">
import { mapActions } from 'vuex'
import Scroll from 'base/scroll/scroll'
import { playMode } from 'common/js/config'
import Confirm from 'base/confirm/confirm'
import { playerMixin } from 'common/js/mixin'
import AddSong from 'components/add-song/add-song'
export default {
  mixins: [playerMixin],
  data() {
    return {
      showFlag: false,
      refreshDelay: 100
    }
  },
  computed: {
    textMode() {
      return this.mode === playMode.sequence
        ? '顺序播放'
        : this.mode === playMode.random ? '随机播放' : '单曲循环'
    }
  },
  methods: {
    addSong() {
      this.$refs.addSong.show()
    },
    // 弹窗返回确认调用删除整个播放列表
    confirmClear() {
      this.deleteSongList()
      // 关闭播放列表
      this.hide()
    },
    // 调用天窗
    showConfirm() {
      this.$refs.confirm.show()
    },
    // 点击去删除点击歌曲
    deleteOne(item) {
      this.deleteSong(item)
      // 当播放长度为0
      if (!this.playlist.length) {
        this.hide()
      }
    },
    // 点击播放歌曲
    selectItem(item, index) {
      // 播放模式
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex(song => {
          return song.id === item.id
        })
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    // 当前播放位置置顶
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex(item => {
        return item.id === current.id
      })
      // 这里需要从li的父元素上获得children 因为li是更新的插入歌曲之后 获取的li的集合还是原来的
      this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300)
    },
    // 设置当前播放的icon
    getCurrentIcon(item) {
      if (item.id === this.currentSong.id) {
        return 'icon-play'
      }
      return ''
    },
    show() {
      this.showFlag = true
      // 由于showFlag变成ture 那么才渲染DOM 所以scroll并不能正确计算 所以需要手动延时refresh
      setTimeout(() => {
        this.$refs.listContent.refresh()
        // 显示的时候就跳到当前播放
        this.scrollToCurrent(this.currentSong)
      }, 20)
    },
    hide() {
      this.showFlag = false
    },
    ...mapActions(['deleteSong', 'deleteSongList'])
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  watch: {
    currentSong(newSong, oldSong) {
      // 没有显示playlist或者上一首和现在是一样的什么都不做
      if (!this.showFlag || newSong.id === oldSong.id) return
      // 不然调到当前点击歌曲置顶 同时去在显示的时候调到当前歌曲置顶
      this.scrollToCurrent(newSong)
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.playlist {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: $color-background-d;

    &.list-fade-enter-active, &.list-fade-leave-active {
        transition: opacity 0.3s;

        .list-wrapper {
            transition: all 0.3s;
        }
    }

    &.list-fade-enter, &.list-fade-leave-to {
        opacity: 0;

        .list-wrapper {
            transform: translate3d(0, 100%, 0);
        }
    }

    &.list-fade-enter, .list-wrapper {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: $color-highlight-background;

        .list-header {
            position: relative;
            padding: 20px 30px 10px 20px;

            .title {
                display: flex;
                align-items: center;

                .icon {
                    margin-right: 10px;
                    font-size: 30px;
                    color: $color-theme-d;
                }

                .text {
                    flex: 1;
                    font-size: $font-size-medium;
                    color: $color-text-l;
                }

                .clear {
                    extend-click();

                    .icon-clear {
                        font-size: $font-size-medium;
                        color: $color-text-d;
                    }
                }
            }
        }

        .list-content {
            max-height: 240px;
            overflow: hidden;

            .item {
                display: flex;
                align-items: center;
                height: 40px;
                padding: 0 30px 0 20px;
                overflow: hidden;

                // 列表动画
                &.list-enter-active, &.list-leave-active {
                    transition: all 0.1s;
                }

                &.list-enter, &.list-leave-to {
                    height: 0;
                }

                .current {
                    flex: 0 0 20px;
                    width: 20px;
                    font-size: $font-size-small;
                    color: $color-theme-d;
                }

                .text {
                    flex: 1;
                    no-wrap();
                    font-size: $font-size-medium;
                    color: $color-text-d;
                }

                .like {
                    extend-click();
                    margin-right: 15px;
                    font-size: $font-size-small;
                    color: $color-theme;

                    .icon-favorite {
                        color: $color-sub-theme;
                    }
                }

                .delete {
                    extend-click();
                    font-size: $font-size-small;
                    color: $color-theme;
                }
            }
        }

        .list-operate {
            width: 140px;
            margin: 20px auto 30px auto;

            .add {
                display: flex;
                align-items: center;
                padding: 8px 16px;
                border: 1px solid $color-text-l;
                border-radius: 100px;
                color: $color-text-l;

                .icon-add {
                    margin-right: 5px;
                    font-size: $font-size-small-s;
                }

                .text {
                    font-size: $font-size-small;
                }
            }
        }

        .list-close {
            text-align: center;
            line-height: 50px;
            background: $color-background;
            font-size: $font-size-medium-x;
            color: $color-text-l;
        }
    }
}
</style>