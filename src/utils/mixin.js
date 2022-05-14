//利用mixin 机制，实现高程度的复用
// 解开组件间的强关联，利于维护
import { mapGetters, mapActions } from "vuex";
import { themesList, addCss, removeAllCss, getReadTimeByMinute } from "@/utils/book";
import { saveLocation, getBookmark, getBookShelf, saveBookShelf } from '@/utils/localStorage'
import { shelf } from '@/api/store';
import { appendAddToShelf, removeAddFromShelf, computedId, gotoBookDetail } from '@/utils/store'

export const storeShelfMixin = {
  computed: {
    ...mapGetters([
      'isEditMode',
      'shelfList',
      'shelfSelected',
      'shelfTitleVisible',
      'offsetY',
      'shelfCategory',
      'currentType'
    ])
  },
  methods: {
    ...mapActions([
      'setIsEditMode',
      'setShelfList',
      'setShelfSelected',
      'setShelfTitleVisible',
      'setOffsetY',
      'setShelfCategory',
      'setCurrentType'
    ]),
    getShelfList() {
      let shelfList = getBookShelf()
      if (!shelfList) {
        shelf().then(response => {
          if (response.status === 200 && response.data && response.data.bookList) {
            shelfList = appendAddToShelf(response.data.bookList)
            saveBookShelf(shelfList)
            return this.setShelfList(shelfList)
          }
        })
      } else {
        return this.setShelfList(shelfList)
      }
    },
    getCategoryList(title) {
      this.getShelfList().then(() => {
        const categoryList = this.shelfList.filter(book => book.type === 2 && book.title === title)[0]
        this.setShelfCategory(categoryList)
      })
    },
    moveOutOfGroup(f) {
      this.setShelfList(
        this.shelfList.map((book) => {
          if (book.type === 2 && book.itemList) {
            book.itemList = book.itemList.filter(
              (subBook) => !subBook.selected
            );
          }
          return book;
        })
      ).then(() => {
        const list = computedId(
          appendAddToShelf(
            [].concat(removeAddFromShelf(this.shelfList), ...this.shelfSelected)
          )
        );
        this.setShelfList(list).then(() => {
          this.simpleToast(this.$t("shelf.moveBookOutSuccess"));
          if (f) f()
        });
      });
    }
  }
}

export const storeHomeMixin = {
  computed: {
    ...mapGetters([
      'offsetY',
      'hotSearchOffsetY',
      'flapCardVisible'
    ]),
  },
  methods: {
    ...mapActions([
      'setOffsetY',
      'setHotSearchOffsetY',
      'setFlapCardVisible'
    ]),
    showBookDetail(book) {
      this.setFlapCardVisible(false)
      gotoBookDetail(this, book)
    }
  }
}

export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookmark'
    ]),
    themesList() {
      return themesList(this);
    },
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookmark'
    ]),
    initGlobalStyle() {
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Default':
          addCss(`${process.env.VUE_APP_RES_URL}/book/res/theme/theme_default.css`)
          break
        case 'Eye':
          addCss(`${process.env.VUE_APP_RES_URL}/book/res/theme/theme_eye.css`)
          break
        case 'Gold':
          addCss(`${process.env.VUE_APP_RES_URL}/book/res/theme/theme_gold.css`)
          break
        case 'Night':
          addCss(`${process.env.VUE_APP_RES_URL}/book/res/theme/theme_night.css`)
          break
        default:
          addCss(`${process.env.VUE_APP_RES_URL}/book/res/theme/theme_default.css`)
          break
      }
    },
    //获取当前页的 location 的页头 cfi 进而存储开头 cfi 并计算、更新当前的 progress
    refreshLocation() {
      const currentLocation = this.currentBook.rendition.currentLocation()
      if (currentLocation && currentLocation.start) {
        const startCfi = currentLocation.start.cfi
        const percentage = this.currentBook.locations.percentageFromCfi(startCfi)
        this.setProgress(Math.floor(percentage * 100))
        this.setSection(currentLocation.start.index)
        saveLocation(this.fileName, startCfi)
        const bookmark = getBookmark(this.fileName)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)) {
            this.setIsBookmark(true)
          } else {
            this.setIsBookmark(false)
          }
        } else {
          this.setIsBookmark(false)
        }
        if (this.pagelist) {
          const totalPage = this.pagelist.length
          const currentPage = currentLocation.start.location
          if (currentPage && currentPage > 0) {
            this.setPaginate(currentPage + '/' + totalPage)
          } else {
            this.setPaginate('')
          }
        } else {
          this.setPaginate('')
        }
      }
    },
    // huidiao 是 refreshLocation 实现后执行的回调方法，在这里我们可以执行自己的业务
    display(target, huidiao) {
      if (target) {
        return this.currentBook.rendition.display(target).then(() => {
          this.refreshLocation()
          if (huidiao) huidiao()
        })
      } else {
        return this.currentBook.rendition.display().then(() => {
          this.refreshLocation()
          if (huidiao) huidiao()
        })
      }
    },
    hideTitleAndMenu() {
      // this.$store.dispatch('setMenuVisible', false)
      // 引入mapActions 将 this.$store.dispatch()取代
      // 为了组件的解耦用 mixin 机制将方法属性集成，在组件用 this.XXX()调用即可
      this.setMenuVisible(false);
      this.setFontFamilyVisible(false);
      this.setSettingVisible(-1)
    },
    getReadTimeText() {
      return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
    },
    getSectionName() {
      //该方法通过当前图书 currentBook 的 navigation 对象只能读取一级目录的 label，二级三级目录读取不到
      // if (this.section) {
      //   const sectionInfo = this.currentBook.section(this.section)
      //   if (sectionInfo && sectionInfo.href && this.currentBook && this.currentBook.navigation) {
      //     return this.currentBook.navigation.get(sectionInfo.href).label
      //   }
      // }
      // 另一种方法，用已经解析好的、将目录数组扁平化的 navigation 对象,
      // 去获取当前 label 就不会报 label is not defined 的错误
      return this.section ? this.navigation[this.section].label : ''
    },
  }
}