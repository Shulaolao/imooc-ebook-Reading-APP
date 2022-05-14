<template>
  <div class="shelf-list" :style="{ top: shelfListTop }">
    <transition-group name="list" tag="div" id="shelf-list">
      <div class="shelf-list-item-wrapper" v-for="item in data" :key="item.id">
        <shelf-item :data="item" :style="{ height: itemHeight }"></shelf-item>
        <div class="shelf-list-title-wrapper">
          <span class="shelf-list-title title-small">{{ item.title }}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { storeShelfMixin } from "@/utils/mixin";
import ShelfItem from "@/components/shelf/ShelfItem.vue";
import { realPx, px2rem } from "@/utils/utils";
export default {
  mixins: [storeShelfMixin],
  components: {
    ShelfItem,
  },
  props: {
    top: {
      type: Number,
      default: 94,
    },
    data: Array,
  },
  computed: {
    itemHeight() {
      // 每张照片是 250 X 350
      return ((window.innerWidth - realPx(120)) / 3 / 250) * 350 + "px";
    },
    shelfListTop() {
      return px2rem(this.top) + "rem";
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.shelf-list {
  position: absolute;
  left: 0;
  z-index: 100;
  width: 100%;
  #shelf-list {
    display: flex;
    flex-flow: row wrap;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    font-size: px2rem(12);
    .shelf-list-item-wrapper {
      flex: 0 0 33.33%;
      width: 33.33%;
      padding: px2rem(15);
      box-sizing: border-box;
      &.list-leave-active {
        display: none;
      }
      &.list-move {
        transition: transform 1s;
      }
      .shelf-list-title-wrapper {
        margin-top: px2rem(10);
        @include ellipses2(2);
      }
    }
  }
}
</style>