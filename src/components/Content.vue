<template>
  <transition name="slide-right">
    <div class="content">
      <div class="content-wrapper" v-if="bookAvailable">
        <div class="content-item" :class="{'indexs':indexs == index}" v-for="(item,index) in navigation.toc" :key="index" @click="jumpTo(item.href,index)">
          <span class="text">{{item.label}}</span>
        </div>
      </div>
      <div class="empty" v-else>加载中...</div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  export default {
    data(){
      return {
        indexs:0
      }
    },
    props: {
      ifShowContent: Boolean,
      navigation: Object,
      bookAvailable: Boolean,

    },
    methods: {
      jumpTo(target,index) {
        this.$emit('jumpTo', target)
        this.indexs = index
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/styles/global";

  .content {
    position: absolute;
    height: 100%;
    width: 80%;
    top: 0;
    left: 0;
    z-index: 103;
    background: white;
    overflow:scroll;
  .content-wrapper {

    .content-item {
      font-size: px2rem(18);
      height: px2rem(50);
      color: #ccc;
      padding: px2rem(10);
      line-height: px2rem(50);
      border-bottom: px2rem(1) solid rgb(249, 248, 248);
    }
    .indexs{
      color: #333;
    }
  }
  .empty{
    font-size: px2rem(20);
    margin: px2rem(30);
    color: #ccc;
  }
}
</style>
