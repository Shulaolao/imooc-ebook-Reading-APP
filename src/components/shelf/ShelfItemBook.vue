<template>
  <div class="shelf-item-book">
    <img :src="data.cover" class="shelf-item-book-cover">
    <div class="icon-private" v-show="data.private"></div>
  </div>
</template>

<script>
export default {
  props: {
    data: Object
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/global";
  .shelf-item-book {
    position: relative;
    width: 100%;
    height: 100%;
    .shelf-item-book-cover {
      width: 100%;
      height: 100%;
    }
    .icon-private {
      position: absolute;
      bottom: px2rem(4);
      left: px2rem(4);
      font-size: px2rem(15);
      color: white;
    }
  }
</style>