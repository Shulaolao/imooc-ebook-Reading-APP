<template>
  <div
    class="shelf-item"
    @click="onItemClick"
    :class="{ 'shelf-item-shadow': data.type === 1 || data.type === 2 }"
  >
    <transition name="slide-left">
      <component
        :is="item"
        :data="data"
        class="shelf-item-comp"
        :class="{ 'is-edit': isEditMode && data.type === 2 }"
      ></component>
    </transition>
    <div
      class="icon-selected"
      :class="{ 'is-selected': data.selected }"
      v-show="isEditMode && data.type === 1"
    ></div>
  </div>
</template>

<script>
import { storeShelfMixin } from "@/utils/mixin";
import ShelfBook from "@/components/shelf/ShelfItemBook.vue";
import ShelfItemCategory from "@/components/shelf/ShelfItemCategory.vue";
import ShelfItemAdd from "@/components/shelf/ShelfItemAdd.vue";
import { gotoStoreHome, gotoBookDetail } from "@/utils/store";
export default {
  mixins: [storeShelfMixin],
  data() {
    return {
      book: ShelfBook,
      category: ShelfItemCategory,
      add: ShelfItemAdd,
    };
  },
  props: {
    data: Object,
  },
  computed: {
    item() {
      return this.data.type === 1
        ? this.book
        : this.data.type === 2
        ? this.category
        : this.add;
    },
  },
  methods: {
    onItemClick() {
      if (!this.isEditMode) {
        if (this.data.type === 1) {
          gotoBookDetail(this, this.data);
        } else if (this.data.type === 2) {
          this.$router.push({
            path: "/store/category",
            query: {
              title: this.data.title,
            },
          });
        } else {
          gotoStoreHome(this);
        }
      } else {
        if (this.data.type === 1) {
          this.data.selected = !this.data.selected;
          if (this.data.selected) {
            this.shelfSelected.pushWithoutDuplicate(this.data);
          } else {
            this.setShelfSelected(
              this.shelfSelected.filter((item) => item.id !== this.data.id)
            );
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "../../assets/styles/global";
.shelf-item {
  position: relative;
  width: 100%;
  height: 100%;
  &.shelf-item-shadow {
    box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, 0.3);
  }
  .shelf-item-comp {
    opacity: 1;
    &.is-edit {
      opacity: 0.5;
    }
  }
  .icon-selected {
    position: absolute;
    bottom: px2rem(2);
    right: px2rem(2);
    font-size: px2rem(18);
    color: rgba(0, 0, 0, 0.4);
    &.is-selected {
      color: $color-blue;
    }
  }
}
</style>