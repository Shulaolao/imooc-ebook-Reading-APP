<template>
  <div class="ebook-footer">
      <span class="progress-text">{{paginate}}</span>
    </div>
</template>

<script>
import {ebookMixin} from '@/utils/mixin'
export default {
    mixins: [ebookMixin]
}
</script>

<style lang='scss' scoped>
@import '@/assets/styles/global.scss';
.ebook-footer {
    display: flex;
    width: 100%;
    height: px2rem(45);
    .progress-text {
      position: absolute;
      bottom: px2rem(20);
      right: px2rem(20);
      font-size: px2rem(14);
    }
  }
</style>