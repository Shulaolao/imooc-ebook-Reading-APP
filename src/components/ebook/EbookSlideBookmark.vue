<template>
  <div class="ebook-slide-bookmark">
    <div class="slide-bookmark-title">
      {{ $t("book.bookmark") }} {{ bookmark ? bookmark.length : 0 }}
    </div>
    <scroll class="slide-bookmark-list" :top="48" :bottom="48">
      <div
        class="slide-bookmark-item"
        v-for="(item, index) in bookmark"
        :key="index"
        @click="displayBookmark(item.cfi)"
      >
        <div class="slide-bookmark-item-icon">
          <div class="icon-bookmark"></div>
        </div>
        <div class="slide-bookmark-item-text">{{ item.text }}</div>
      </div>
    </scroll>
  </div>
</template>

<script type='text/ecmascript-6'>
import Scroll from "@/components/common/Scroll.vue";
import { getBookmark } from "@/utils/localStorage";
import { ebookMixin } from "@/utils/mixin";
export default {
  mixins: [ebookMixin],
  components: {
    Scroll,
  },
  data() {
    return {
      bookmark: null,
    };
  },
  methods: {
    displayBookmark(target) {
      this.display(target, () => {
        this.hideTitleAndMenu();
      });
    },
  },
  mounted() {
    this.bookmark = getBookmark(this.fileName);
  },
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/global.scss";
.ebook-slide-bookmark {
    width: 100%;
  .slide-bookmark-title {
      width: 100%;
      height: px2rem(48);
      font-size: px2rem(14);
      font-weight: bold;
      padding: 0 px2rem(15);
        box-sizing: border-box;
        @include left;
  }
  .slide-bookmark-list {
      padding: 0 px2rem(15);
      box-sizing: border-box;
    .slide-bookmark-item {
        display: flex;
      padding: px2rem(15) 0;
      box-sizing: border-box;
      .slide-bookmark-item-icon {
        flex: 0 0 px2rem(29);
        @include left;
        .icon-bookmark {
            width: px2rem(20);
            height: px2rem(20);
            border-radius: 50%;
            font-size: px2rem(12);
            background: #bbb;
            @include center;
        }
      }
      .slide-bookmark-item-text {
          line-height: px2rem(15);
          max-height: px2rem(45);
        font-size: px2rem(14);
        @include ellipses2(3);
      }
    }
  }
}
</style>