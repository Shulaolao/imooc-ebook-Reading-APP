<template>
  <transition name="slide-right">
    <div class="store-home">
      <search-bar></search-bar>
      <flap-card :data="random" @resetBook="resetBook"></flap-card>
      <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
        <div class="banner-wrapper">
          <div
            class="banner-img"
            :style="
              banner !== null ? { backgroundImage: `url('${banner}')` } : ''
            "
          ></div>
        </div>
        <guess-you-like :data="guessYouLike"></guess-you-like>
        <recommend :data="recommend" class="recommend"></recommend>
        <featured
          class="featured"
          :data="featured"
          :titleText="$t('home.featured')"
          :btnText="$t('home.seeAll')"
        ></featured>
        <div
          class="category-list-wrapper"
          v-for="(item, index) in categoryList"
          :key="index"
        >
          <category-book :data="item"></category-book>
        </div>
        <category :data="categories" class="category"></category>
      </scroll>
    </div>
  </transition>
</template>

<script>
import SearchBar from "@/components/home/SearchBar.vue";
import Scroll from "@/components/common/Scroll.vue";
import { storeHomeMixin } from "@/utils/mixin";
import HotSearchList from "@/components/home/HotSearchList.vue";
import { home } from "@/api/store";
import FlapCard from "@/components/home/FlapCard.vue";
import GuessYouLike from "@/components/home/GuessYouLike.vue";
import Recommend from "@/components/home/Recommend.vue";
import Featured from "@/components/home/Featured.vue";
import CategoryBook from "@/components/home/CategoryBook.vue";
import Category from "@/components/home/Category.vue";
export default {
  mixins: [storeHomeMixin],
  data() {
    return {
      scrollTop: 94,
      random: null,
      banner: null,
      guessYouLike: null,
      recommend: null,
      featured: null,
      categoryList: [],
      categories: [],
    };
  },
  components: {
    SearchBar,
    Scroll,
    HotSearchList,
    FlapCard,
    GuessYouLike,
    Recommend,
    Featured,
    CategoryBook,
    Category,
  },
  methods: {
    resetBook() {
      this.random = null;
      this.getMockBook();
    },
    getMockBook() {
      home().then((response) => {
        if (response.status === 200) {
          let data = response.data;
          this.banner = data.banner;
          this.guessYouLike = data.guessYouLike;
          this.recommend = data.recommend;
          this.featured = data.featured;
          this.categoryList = data.categoryList;
          this.categories = data.categories;
          let randomIndex = Math.floor(Math.random() * data.random.length);
          this.random = data.random[randomIndex];
        }
      });
    },
    onScroll(offsetY) {
      // this.$refs.scroll.scrollTo(0, this.offsetY)
      this.setOffsetY(offsetY);
      if (this.offsetY > 0) {
        this.scrollTop = 52;
      } else {
        this.scrollTop = 94;
      }
      this.$refs.scroll.refresh();
    },
  },
  mounted() {
    this.getMockBook();
  },
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/global.scss";
.store-home {
  width: 100%;
  height: 100%;
  z-index: 150;
  .banner-wrapper {
    width: 100%;
    padding: px2rem(10);
    box-sizing: border-box;
    .banner-img {
      width: 100%;
      height: px2rem(160);
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
  }
  .recommend {
    margin-top: px2rem(20);
  }
  .featured {
    margin-top: px2rem(20);
  }
  .category-list-wrapper {
    margin-top: px2rem(20);
  }
  .category {
    margin-top: px2rem(20);
  }
}
</style>