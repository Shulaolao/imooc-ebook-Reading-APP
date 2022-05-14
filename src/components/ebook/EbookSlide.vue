<template>
  <transition name="fade">
    <div
      class="silde-content-wrapper"
      v-show="menuVisible && settingVisible === 3"
    >
      <transition name="ebook-slide-right">
        <div class="content" v-if="settingVisible === 3">
          <div class="content-page-wrapper" v-if="bookAvailable">
            <div class="content-page">
              <component
                :is="currentTab === 1 ? content : bookmark"
              ></component>
            </div>
            <div class="content-page-tab">
              <div
                class="content-page-tab-item"
                :class="{ selected: currentTab === 1 }"
                @click="selectTab(1)"
              >
                {{ $t("book.navigation") }}
              </div>
              <div
                class="content-page-tab-item"
                :class="{ selected: currentTab === 2 }"
                @click="selectTab(2)"
              >
                {{ $t("book.bookmark") }}
              </div>
            </div>
          </div>
          <div v-else class="content-empty">
            <ebook-loading></ebook-loading>
          </div>
        </div>
      </transition>
      <div class="content-bg" @click="hideTitleAndMenu"></div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from "@/utils/mixin";
import EbookSlideContents from "@/components/ebook/EbookSlideContents.vue";
import EbookLoading from '@/components/ebook/EbookLoading.vue'
import EbookSlideBookmark from '@/components/ebook/EbookSlideBookmark.vue'
export default {
  mixins: [ebookMixin],
  components: {
    EbookLoading
  },
  data() {
    return {
      currentTab: 1,
      content: EbookSlideContents,
      bookmark: EbookSlideBookmark,
    };
  },
  methods: {
    selectTab(key) {
      this.currentTab = key;
    }
  },
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/global.scss";
.silde-content-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 300;
  display: flex;
  width: 100%;
  height: 100%;
  .content {
    flex: 0 0 85%;
    width: 85%;
    height: 100%;
    .content-page-wrapper {
      display: flex;
      width: 100%;
      height: 100%;
      flex-direction: column;
      .content-page {
        flex: 1;
        width: 100%;
        overflow: hidden;
      }
      .content-page-tab {
        flex: 0 0 px2rem(48);
        width: 100%;
        height: px2rem(48);
        display: flex;
        .content-page-tab-item {
          flex: 1;
          font-size: px2rem(12);
          @include center;
        }
      }
    }
  }
  .content-empty {
    width: 100%;
    height: 100%;
    @include center;
  }
  .content-bg {
    flex: 0 0 15%;
    width: 15%;
    height: 100%;
    background-color: rgba(97, 114, 96, 0.7) !important;
  }
}
</style>