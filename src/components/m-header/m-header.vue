<template>
<div class="m-header">
    <div class="icon"></div>
    <h1 class="text">web音乐</h1>
    <!-- 一级路由的view都在app.vue -->
    <router-link to="/user" class="mine" tag="div">
        <i class="icon-mine"></i>
    </router-link> 
</div>
</template>
<script type="text/ecmascript-6">
export default {}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.m-header {
    position: relative;
    height: 88px;
    text-align: center;
    color: $color-theme;
    font-size: 0;

    .icon {
        display: inline-block;
        vertical-align: top;
        margin-top: 12px;
        width: 60px;
        height: 64px;
        margin-right: 18px;
        bg-image('logo');
        background-size: 60px 64px;
    }

    .text {
        display: inline-block;
        vertical-align: top;
        line-height: 80px;
        font-size: $font-size-large;
    }

    .mine {
        position: absolute;
        top: 0;
        right: 0;

        .icon-mine {
            display: block;
            padding: 24px;
            font-size: 40px;
            color: $color-theme;
        }
    }
}
</style>