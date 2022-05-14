<template>
  <div>
    <transition name="slide-up">
      <div
        class="menu-wrapper"
        v-show="menuVisible"
        :class="{ 'hide-box-shadow': !menuVisible || settingVisible >= 0 }"
      >
        <div class="icon-wrapper">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-a" @click="showSetting(0)">A</span>
        </div>
      </div>
    </transition>
    <!-- <div class="progress-text">
      <span>{{getProgressText()}}</span>
    </div> -->
    <ebook-setting-font></ebook-setting-font>
    <ebook-font-family-popup></ebook-font-family-popup>
    <ebook-setting-themes></ebook-setting-themes>
    <ebook-setting-progress></ebook-setting-progress>
    <ebook-slide></ebook-slide>
  </div>
</template>

<script>
import EbookSettingFont from './EbookSettingFont.vue'
import {ebookMixin} from '@/utils/mixin'
import EbookFontFamilyPopup from './EbookFontFamilyPopup.vue'
import EbookSettingThemes from '@/components/ebook/EbookSettingThemes.vue'
import EbookSettingProgress from '@/components/ebook/EbookSettingProgress.vue'
import EbookSlide from '@/components/ebook/EbookSlide.vue'
export default {
    mixins: [ebookMixin],
    components: {
      EbookSettingFont,
      EbookFontFamilyPopup,
      EbookSettingThemes,
      EbookSettingProgress,
      EbookSlide
    },
    computed: {
      
    },
    methods: {
        showSetting(key) {
          this.setSettingVisible(key)
        },
        // getProgressText() {
        //   console.log(this.currentBook,1);
        //   const percentage = this.currentBook.rendition.location.start.percentage
        //   return Math.floor(percentage*100) 
        // },
    },
};
</script>

<style lang='scss' rel="stylesheet/scss" scoped>
@import "@/assets/styles/global.scss";
  .menu-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    z-index: 200;
    width: 100%;
    height: px2rem(48);
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
    background-color: white;
    font-size: px2rem(20);
    &.hide-box-shadow {
      box-shadow: none;
    }
    .icon-wrapper {
      flex: 1;
      @include center;
      .icon-progress {
        font-size: px2rem(24);
      }
      .icon-bright {
        font-size: px2rem(22);
      }
    }
  }
  .ebook-reader {
    position: relative;
    .progress-text {
      position: absolute;
      bottom: 15px;
      right: 15px;
      z-index: 100;
      font-size: px2rem(20);
      color: white;
    }
  }
</style>