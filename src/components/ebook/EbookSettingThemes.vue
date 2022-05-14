<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 1">
      <div class="setting-theme">
        <div
          class="setting-theme-item"
          v-for="(item, index) in themesList"
          :key="index"
          @click="setThemes(index)"
        >
          <div
            class="preview"
            :style="{ background: item.style.body.background }"
            :class="{ selected: item.name === defaultTheme }"
          ></div>
          <div class="text" :class="{ selected: item.name === defaultTheme }">
            {{ item.alias }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ebookMixin } from "@/utils/mixin";
import {saveTheme} from '@/utils/localStorage';
export default {
  mixins: [ebookMixin],
  methods: {
    setThemes(index) {
        let theme = this.themesList[index]
        this.setDefaultTheme(theme.name).then(() => {
          this.currentBook.rendition.themes.select(this.defaultTheme)
          saveTheme(this.fileName, theme.name)
          this.setDefaultTheme(theme.name)
          this.initGlobalStyle()
        })
    },
  },
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/global.scss";
.setting-wrapper {
  position: absolute;
  bottom: px2rem(48);
  display: flex;
  flex-direction: column;
  left: 0;
  width: 100%;
  z-index: 160;
  height: px2rem(90);
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
  background: white;
  .setting-theme {
    height: 100%;
    display: flex;
    .setting-theme-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: px2rem(5);
      box-sizing: border-box;
      .preview {
        flex: 1;
        border: px2rem(1) solid #ccc;
        box-sizing: border-box;
        &.selected {
            box-shadow: 0 px2rem(4) px2rem(6) 0 rgba(0,0,0,.1);
        }
      }
      .text {
        float: 0 0 px2rem(20);
        font-size: px2rem(14);
        color: #ccc;
        @include center;
        &.selected {
          color: #333;
        }
      }
    }
  }
}
</style>