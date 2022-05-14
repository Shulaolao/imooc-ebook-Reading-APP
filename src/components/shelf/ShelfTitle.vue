<template>
  <transition name="fade">
    <div
      class="shelf-title"
      v-show="shelfTitleVisible"
      :class="{ 'hide-shadow': ifHideShadow }"
    >
      <div class="shelf-title-text-wrapper">
        <transition name="title-slide-up">
          <span class="shelf-title-text">{{ title }}</span>
        </transition>
        <transition name="small-popup-slide-up">
          <span class="shelf-title-sub-text" v-show="isEditMode">{{
            selectedText
          }}</span>
        </transition>
      </div>
      <div
        class="shelf-title-btn-wrapper shelf-title-btn-left"
        v-show="!showBack && showClear"
      >
        <span class="shelf-title-btn-text" @click="clearCache">{{
          $t("shelf.clearCache")
        }}</span>
      </div>
      <div
        class="shelf-title-btn-wrapper shelf-title-btn-right"
        @click="onEditClick"
        v-if="showEdit"
      >
        <span class="shelf-title-btn-text">{{
          isEditMode ? $t("shelf.cancel") : $t("shelf.edit")
        }}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-btn-left" v-if="showBack">
        <span class="icon-back" @click="back"></span>
      </div>
      <div
        class="shelf-title-btn-wrapper"
        :class="{
          'shelf-title-btn-left': changeGroupLeft,
          'shelf-title-btn-right': changeGroupRight,
        }"
        v-if="showChangeGroup || !showEdit"
        @click="changeGroup"
      >
        <span class="shelf-title-btn-text">{{ $t("shelf.editGroup") }}</span>
      </div>
    </div>
  </transition>
</template>

<script>
import { storeShelfMixin } from "@/utils/mixin";
import { saveBookShelf } from "@/utils/localStorage";
export default {
  mixins: [storeShelfMixin],
  data() {
    return {
      ifHideShadow: true,
      popupMenu: "",
    };
  },
  props: {
    title: String,
  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0) {
        this.ifHideShadow = false;
      } else {
        this.ifHideShadow = true;
      }
    }
  },
  computed: {
    emptyCategory() {
      return (
        !this.shelfCategory ||
        !this.shelfCategory.itemList ||
        this.shelfCategory.itemList.length === 0
      );
    },
    showEdit() {
      return this.currentType === 1 || !this.emptyCategory;
    },
    showClear() {
      return this.currentType === 1;
    },
    showBack() {
      return this.currentType === 2 && !this.isEditMode;
    },
    showChangeGroup() {
      return this.currentType === 2 && this.isEditMode;
    },
    changeGroupRight() {
      return !this.showEdit;
    },
    changeGroupLeft() {
      return this.showEdit;
    },
    selectedText() {
      const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0;
      return selectedNumber === 0
        ? this.$t("shelf.selectBook")
        : selectedNumber === 1
        ? this.$t("shelf.haveSelectedBook").replace("$1", 1)
        : this.$t("shelf.haveSelectedBooks").replace("$1", selectedNumber);
    },
  },
  methods: {
    onComplete() {
      this.hidePopup();
      this.setShelfList(
        this.shelfList.filter((book) => book.id !== this.shelfCategory.id)
      ).then(() => {
        saveBookShelf(this.shelfList);
        setTimeout(() => {
          this.$router.isBack = true
          this.$router.go(-1)
        }, 600)
        this.setIsEditMode(false)
      });
    },
    deleteGroup() {
      if (!this.emptyCategory) {
        this.setShelfSelected(this.shelfCategory.itemList);
        this.moveOutOfGroup(this.onComplete);
      } else {
        this.onComplete();
      }
    },
    showDeleteGroup() {
      this.hidePopup();
      this.popupMenu = this.popup({
        title: this.$t("shelf.deleteGroupTitle"),
        btn: [
          {
            text: this.$t("shelf.confirm"),
            type: "danger",
            click: () => {
              this.deleteGroup(this.shelfCategory.title);
            },
          },
          {
            text: this.$t("shelf.cancel"),
            click: () => {
              this.hidePopup();
            },
          },
        ],
      });
      setTimeout(() => {
        this.popupMenu.show();
      }, 200);
    },
    hidePopup() {
      this.popupMenu.hide();
    },
    changeGroupName() {
      this.hidePopup();
      this.dialog({
        showNewGroup: true,
        changeGroupName: true,
        groupName: this.shelfCategory.title,
      }).show();
    },
    changeGroup() {
      this.popupMenu = this.popup({
        title: "",
        btn: [
          {
            text: this.$t("shelf.editGroupName"),
            click: () => {
              this.changeGroupName();
            },
          },
          {
            text: this.$t("shelf.deleteGroup"),
            type: "danger",
            click: () => {
              this.showDeleteGroup();
            },
          },
          {
            text: this.$t("shelf.cancel"),
            click: () => {
              this.hidePopup();
            },
          },
        ],
      }).show();
    },
    back() {
      this.$router.isBack = true
      this.$router.go(-1);
      this.setIsEditMode(false);
    },
    clearCache() {
      this.dialog({
        haveConfirmTitle: true
      }).show()
    },
    onEditClick() {
      if (!this.isEditMode) {
        this.setShelfSelected([]);
        this.shelfList.forEach((item) => {
          item.selected = false;
          if (item.itemList) {
            item.itemList.forEach((subItem) => {
              subItem.selected = false;
            });
          }
        });
      }
      this.setIsEditMode(!this.isEditMode);
    },
  },
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "@/assets/styles/global";
.shelf-title {
  position: relative;
  width: 100%;
  z-index: 130;
  height: px2rem(42);
  background: white;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, 0.1);
  &.hide-shadow {
    box-shadow: none;
  }
  .shelf-title-text-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    height: px2rem(42);
    width: 100%;
    @include columnCenter;
    .shelf-title-text {
      font-size: px2rem(16);
      line-height: px2rem(20);
      font-weight: bold;
      color: #333;
    }
    .shelf-title-sub-text {
      font-size: px2rem(10);
      color: #333;
    }
  }
  .shelf-title-btn-wrapper {
    position: absolute;
    top: 0;
    color: #666;
    height: 100%;
    @include columnCenter;
    .shelf-title-btn-text {
      padding-left: px2rem(15);
      font-size: px2rem(14);
    }
    .icon-back {
      font-size: px2rem(20);
    }
    &.shelf-title-btn-left {
      padding-left: px2rem(15);
      left: 0;
    }
    &.shelf-title-btn-right {
      padding-right: px2rem(15);
      right: 0;
    }
  }
}
</style>