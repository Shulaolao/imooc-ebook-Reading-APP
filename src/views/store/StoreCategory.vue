<template>
    <div class="store-shelf category">
      <shelf-title :title="shelfCategory.title"></shelf-title>
      <scroll
        class="store-shelf-scroll-wrapper"
        :top="0"
        :bottom="scrollBottom"
        @onScroll="onScroll"
        ref="scroll"
      >
        <shelf-list
          :data="shelfCategory.itemList"
          :top="42"
          v-if="ifShowList"
        ></shelf-list>
        <div class="store-shelf-empty-view" v-else>
          {{ $t("shelf.groupNone") }}
        </div>
      </scroll>
      <shelf-footer :data="shelfCategory.itemList"></shelf-footer>
    </div>
</template>

<script>
import ShelfTitle from "@/components/shelf/ShelfTitle.vue";
import Scroll from "@/components/common/Scroll.vue";
import ShelfSearch from "@/components/shelf/ShelfSearch.vue";
import { storeShelfMixin } from "@/utils/mixin";
import ShelfList from "@/components/shelf/ShelfList.vue";
import ShelfFooter from "@/components/shelf/ShelfFooter.vue";
export default {
  mixins: [storeShelfMixin],
  components: {
    ShelfTitle,
    Scroll,
    ShelfSearch,
    ShelfList,
    ShelfFooter,
  },
  watch: {
    isEditMode(isEditMode) {
      this.scrollBottom = isEditMode ? 48 : 0;
      this.$nextTick(() => {
        this.$refs.scroll.refresh();
      });
    },
  },
  data() {
    return {
      scrollBottom: 0,
    };
  },
  methods: {
    onScroll(offsetY) {
      this.setOffsetY(offsetY);
    },
  },
  mounted() {
    this.getCategoryList(this.$route.query.title);
    this.setCurrentType(2);
  },
  computed: {
    ifShowList() {
      return (
        this.shelfCategory.itemList && this.shelfCategory.itemList.length > 0
      );
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.store-shelf {
  position: relative;
  z-index: 100;
  width: 100%;
  height: 100%;
  background: white;
  .store-shelf-scroll-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
  }
  .store-shelf-empty-view {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    font-size: px2rem(14);
    color: #333;
    @include center;
  }
}
</style>