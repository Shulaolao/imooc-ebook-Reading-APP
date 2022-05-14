<template>
  <div class="ebook" ref="ebook">
    <!-- <EbookReader/> -->
    <ebook-header></ebook-header>
    <ebook-title></ebook-title>
    <ebook-reader></ebook-reader>
    <ebook-menu></ebook-menu>
    <ebook-bookmark></ebook-bookmark>
    <ebook-footer></ebook-footer>
  </div>
</template>

<script>
import EbookReader from '@/components/ebook/EbookReader.vue';
import EbookTitle from '@/components/ebook/EbookTitle.vue';
import EbookMenu from '@/components/ebook/EbookMenu.vue';
import { getReadTime, saveReadTime } from '@/utils/localStorage';
import {ebookMixin} from '@/utils/mixin';
import EbookBookmark from '@/components/ebook/EbookBookmark.vue';
import EbookHeader from '@/components/ebook/EbookHeader.vue';
import EbookFooter from '@/components/ebook/EbookFooter.vue';
export default {
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookBookmark,
    EbookHeader,
    EbookFooter
  },
  //通过 watch 监听 vuex 计算属性 computed 里面的数据变化
  //一旦有数据通过 actions 进行数据更新时就会呗监听到
  watch: {
    offsetY(v) {
      if (!this.menuVisible && this.bookAvailable) {
        if (v > 0) {
          this.move(v)
        } else if (v === 0) {
          this.restore()
        }
      }
    }
  },
  methods: {
    restore() {
      this.$refs.ebook.style.top = 0
      this.$refs.ebook.style.transition = 'all .2s linear'
      setTimeout(() => {
        this.$refs.ebook.style.transition = ''
      }, 200)
    },
    move(v) {
      this.$refs.ebook.style.top = v + 'px'
    },
    startLoopReadTime() {
      let readTime = getReadTime(this.fileName)
      if (!readTime) {
        readTime = 0
      }
      this.task = setInterval(() => {
        readTime++
        if(readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime)
        }
      }, 1000)      
    },
  },
  mounted() {
    this.startLoopReadTime()
  },
  beforeDestroy() {
    if (this.task) {
      clearInterval(this.task)
    }
  }
}
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import '../../assets/styles/global.scss';
.ebook {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}
</style>