<template>
  <div class="ebook-header">
    <span class="ebook-header-text">{{ getSectionName() }}</span>
    <span class="ebook-header-time">{{ nowTime }}</span>
  </div>
</template>

<script>
import { ebookMixin } from "@/utils/mixin";
export default {
  mixins: [ebookMixin],
  data() {
    return {
      nowTime: "",
    };
  },
  methods: {
    getDateTime() {
      var date = new Date(),
        hour = date.getHours() + 1,
        minute = date.getMinutes(),
        second = date.getSeconds();
      hour = checkTime(hour);
      minute = checkTime(minute);
      second = checkTime(second);
      function checkTime(i) {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
      }
      this.nowTime = `${hour + " : " + minute}`;
    },
  },
  mounted() {
    this.getDateTime();
    setInterval(() => {
      this.getDateTime();
    }, 60000);
  },
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/global.scss";
.ebook-header {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: px2rem(48);
  padding: 0 px2rem(15);
  box-sizing: border-box;
  overflow: hidden;
  @include left;
  .ebook-header-text {
    font-size: px2rem(12);
    color: #6d7178;
  }
  .ebook-header-time {
    position: absolute;
    right: px2rem(32);
    font-size: px2rem(12);
  }
}
</style>