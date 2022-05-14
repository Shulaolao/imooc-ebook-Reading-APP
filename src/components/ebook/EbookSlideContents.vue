<template>
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <transition name="extend-right">
        <div class="slide-contents-search-input-wrapper">
          <div class="slide-contents-search-icon">
            <span class="icon-search"></span>
          </div>
          <input
            type="text"
            class="slide-contents-search-input"
            :placeholder="$t('book.searchHint')"
            @click="showSearchPage"
            v-model="searchText"
            @keyup.enter.exact="search()"
          />
        </div>
      </transition>
      <transition name="fade-slide-left">
        <div
          class="slide-contents-search-cancel"
          @click="hideSearchPage"
          v-if="searchVisible"
        >
          {{ $t("book.cancel") }}
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="slide-contents-book-wrapper" v-show="!searchVisible">
        <div class="slide-contents-book-img-wrapper">
          <img :src="cover" class="slide-contents-book-img" />
        </div>
        <div class="slide-contents-book-info-wrapper">
          <div class="slide-contents-book-title">
            <span class="slide-contents-book-title-text">{{ metadata.title }}</span>
          </div>
          <div class="slide-contents-book-author">
            <span class="slide-contents-book-author-text">{{ metadata.creator}}</span>
          </div>
        </div>
        <div class="slide-contents-book-progress-wrapper">
          <div class="slide-contents-book-progress">
            <span class="progress">{{ progress + "%" }}</span>
            <span class="progress-text">{{ $t("book.haveRead2") }}</span>
          </div>
          <div class="slide-contents-book-time">{{ getReadTimeText() }}</div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <scroll
        class="slide-contents-list"
        :top="156"
        :bottom="48"
        ref="scroll"
        v-show="!searchVisible"
      >
        <div
          class="slide-contents-item"
          v-for="(item, index) in navigation"
          :key="index"
        >
          <span
            class="slide-contents-item-label"
            :style="contentItemStyle(item)"
            :class="{ selected: section === index }"
            @click="displayNavigation(item.href)"
            >{{ item.label }}</span
          >
          <span class="slide-contents-item-page">{{item.page}}</span>
        </div>
      </scroll>
    </transition>
    <transition name="fade">
      <scroll
        class="slide-search-list"
        :top="66"
        :bottom="48"
        v-show="searchVisible"
      >
        <div
          class="slide-search-item"
          v-for="(item, index) in searchList"
          :key="index"
          v-html="item.excerpt"
          @click="displayNavigation(item.cfi, true)"
        >
        </div>
      </scroll>
    </transition>
  </div>
</template>

<script>
import { ebookMixin } from "@/utils/mixin";
import Scroll from "@/components/common/Scroll.vue";
import { px2rem } from "@/utils/utils";
export default {
  mixins: [ebookMixin],
  components: {
    Scroll,
  },
  data() {
    return {
      searchVisible: false,
      searchList: null,
      searchText: "",
    };
  },
  methods: {
    search() {
      if (this.searchText && this.searchText.length > 0) {
        this.doSearch(this.searchText).then(list => {
          this.searchList = list
          this.searchList.map(item => { 
            item.excerpt = item.excerpt.replace(this.searchText, `<span class='content-search-text'>${this.searchText}</span>`)
            return item
          })
        })
      }
    },
    doSearch(q) {
      return Promise.all(
        //spineItems 即是 sections
        this.currentBook.spine.spineItems.map((section) =>
          section
            .load(this.currentBook.load.bind(this.currentBook))
            .then(section.find.bind(section, q))
            .finally(section.unload.bind(section))
        )
      ).then((results) => Promise.resolve([].concat.apply([], results)));
    },
    displayNavigation(target, highlight = false) {
      this.display(target, () => {
        this.hideTitleAndMenu();
        if (highlight) {
          this.currentBook.rendition.annotations.highlight(target)
        }
      });
    },
    contentItemStyle(item) {
      return {
        marginLeft: `${px2rem(item.level * 15)}rem`,
      };
    },
    hideSearchPage() {
      this.searchVisible = false;
      this.searchText = ''
      this.searchList = null
    },
    showSearchPage() {
      this.searchVisible = true;
    },
  },
  //不能保证全部组件都挂载完毕，希望等整个视图渲染完毕可以调用 $nextTick()
  // mounted() {
  //   this.doSearch('post').then((res) => {
  //     this.searchList = res
  //   })
  // }
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/global.scss";
.ebook-slide-contents {
  width: 100%;
  font-size: 0;
  .slide-contents-search-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(36);
    margin: px2rem(20) 0 px2rem(10) 0;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-search-input-wrapper {
      flex: 1;
      @include center;
      .slide-contents-search-icon {
        flex: 0 0 px2rem(28);
        font-size: px2rem(12);
        @include center;
      }
      .slide-contents-search-input {
        flex: 1;
        width: 100%;
        height: px2rem(28);
        font-size: px2rem(14);
        background-color: transparent;
        border: none;
        &:focus {
          outline: none;
        }
      }
    }
    .slide-contents-search-cancel {
      flex: 0 0 px2rem(50);
      font-size: px2rem(14);
      @include right;
    }
  }
  .slide-contents-book-wrapper {
    width: 100%;
    padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
    height: px2rem(90);
    box-sizing: border-box;
    @include center;
    .slide-contents-book-img-wrapper {
      flex: 0 0 px2rem(45);
      .slide-contents-book-img {
        width: px2rem(45);
        height: px2rem(60);
      }
    }
    .slide-contents-book-info-wrapper {
      flex: 1;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      .slide-contents-book-title {
        // width: px2rem(153.75);
        font-size: px2rem(14);
        line-height: px2rem(16);
        @include left;
        @include ellipses2(2);
        .slide-contents-book-title-text {
          @include ellipses2(3);
        }
      }
      .slide-contents-book-author {
        // width: px2rem(153.75);
        font-size: px2rem(14);
        margin-top: px2rem(8);
        @include ellipses2(2);
        .slide-contents-book-author-text {
          @include ellipses2(1);
        }
      }
    }
    .slide-contents-book-progress-wrapper {
      flex: 0 0 px2rem(70);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      .slide-contents-book-progress {
        font-size: px2rem(14);
        line-height: px2rem(25);
      }
      .slide-contents-book-time {
        font-size: px2rem(12);
        line-height: px2rem(25);
      }
    }
  }
  .slide-contents-list {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-item {
      display: flex;
      padding: px2rem(20) 0;
      box-sizing: border-box;
      .slide-contents-item-label {
        flex: 1;
        font-size: px2rem(12);
        // line-height: 14px; //解决部分英文单词不完整的问题
        @include ellipsis;
      }
      .slide-contents-item-page {
        flex: 0 0 px2rem(30);
        font-size: px2rem(10);
        @include right;
      }
    }
  }
  .slide-search-list {
    width: 100%;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-search-item {
      font-size: px2rem(12);
      line-height: px2rem(14);
      padding: px2rem(20) 0;
      box-sizing: border-box;
    }
  }
}
</style>