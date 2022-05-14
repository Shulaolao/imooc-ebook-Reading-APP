<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div
      class="ebook-reader-mask"
      @click="onMaskClick"
      @touchmove="move"
      @touchend="moveEnd"
      @mousedown.left="onMouseEnter"
      @mousemove.left="onMouseMove"
      @mouseup.left="onMouseEnd"
    ></div>
  </div>
</template>

<script>
import Epub from "epubjs";
import { ebookMixin } from "@/utils/mixin";
import {
  getFontFamily,
  getFontSize,
  saveFontFamily,
  saveFontSize,
  saveTheme,
  getTheme,
  getLocation,
} from "@/utils/localStorage";
import {getLocalForage} from '@/utils/localForage'
import { flatten } from "@/utils/book";
global.ePub = Epub;
export default {
  mixins: [ebookMixin],
  methods: {
    onMouseEnter(e) {
      // console.log('mousedown');
      this.mouseState = 1;
      e.preventDefault();
      e.stopPropagation();
    },
    onMouseMove(e) {
      // console.log('mouseMove');
      if (this.mouseState === 1) {
        this.mouseState = 2;
      } else if (this.mouseState === 2) {
        let offsetY = 0;
        if (this.firstOffsetY) {
          offsetY = e.clientY - this.firstOffsetY;
          this.setOffsetY(offsetY);
        } else {
          this.firstOffsetY = e.clientY;
        }
      }
      e.preventDefault();
      e.stopPropagation();
    },
    onMouseEnd(e) {
      // console.log('mouseup');
      if (this.mouseState === 2) {
        this.setOffsetY(0);
        this.firstOffsetY = null;
        this.mouseState = 3;
      } else {
        this.mouseState = 4;
      }
      // 点击并拖动时间比较短时，对此操作视为点击动作
      const time = e.timeStamp - this.mouseStartTime;
      if (time < 200) {
        this.mouseState = 4;
      }
      e.preventDefault();
      e.stopPropagation();
    },
    move(e) {
      // console.log('touchmove');
      let offsetY = 0;
      if (this.firstOffsetY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY;
        this.setOffsetY(offsetY);
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY;
      }
      e.preventDefault(); //微信阅读时下拉标签，子网页会显示（'此网页由……提供'）
      e.stopPropagation();
    },
    moveEnd(e) {
      // console.log('touchend');
      this.setOffsetY(0);
      this.firstOffsetY = null;
    },
    onMaskClick(e) {
      // 当鼠标点击事件触发时不触发蒙板的点击事件
      if (this.mouseState && (this.mouseState === 2 || this.mouseState === 3)) {
        return;
      }
      const offsetX = e.offsetX;
      const width = window.innerWidth;
      if (offsetX > 0 && offsetX < width * 0.3) {
        this.prevPage();
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage();
      } else {
        this.toggleTitleAndMenu();
      }
    },
    prevPage() {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation();
        });
        this.hideTitleAndMenu();
      }
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation();
        });
        this.hideTitleAndMenu();
      }
    },
    toggleTitleAndMenu() {
      if (this.menuVisible) {
        this.setSettingVisible(-1);
        this.setFontFamilyVisible(false);
      }
      this.setMenuVisible(!this.menuVisible);
    },
    initFontFamily() {
      //从 LocalStorage 获取本地存储的字体样式
      let font = getFontFamily(this.fileName);
      if (!font) {
        saveFontFamily(this.fileName, this.defaultFontFamily);
      } else {
        this.rendition.themes.font(font);
        this.setDefaultFontFamily(font);
      }
    },
    initFontSize() {
      //从 LocalStorage 获取本地存储的字体大小
      let fontSize = getFontSize(this.fileName);
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize);
      } else {
        this.rendition.themes.fontSize(fontSize);
        this.setDefaultFontSize(fontSize);
      }
    },
    initTheme() {
      //从本地获取主题，如果为空则初始化为 default
      let defaultTheme = getTheme(this.fileName);
      if (!defaultTheme) {
        defaultTheme = this.themesList[0].name;
        saveTheme(this.fileName, this.defaultTheme);
      }
      this.setDefaultTheme(defaultTheme);
      this.themesList.forEach((theme) => {
        //逐个注册主题
        this.rendition.themes.register(theme.name, theme.style);
      });
      this.rendition.themes.select(defaultTheme);
    },
    initRendition() {
      this.rendition = this.book.renderTo("read", {
        width: innerWidth,
        heigth: innerHeight,
        method: "default", //paginated 翻页
        // 滚动阅读模式(阅读更流畅)，但目前在微信端和safari浏览器不支持
        // flow: 'scrolled'
      });
      const location = getLocation(this.fileName);
      this.display(location, () => {
        this.initFontFamily();
        this.initFontSize();
        this.initTheme();
        this.initGlobalStyle();
      });
      this.rendition.hooks.content.register((contents) => {
        Promise.all([
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/cabin.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`
          ),
        ]).then(() => {}); //增加自己的业务逻辑
      });
    },
    initGesture() {
      this.rendition.on("touchstart", (event) => {
        this.touchStartX = event.changedTouches[0].clientX;
        this.touchStartTime = event.timeStamp;
      });
      this.rendition.on("touchend", (event) => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX;
        const time = event.timeStamp - this.touchStartTime;
        if (time < 500 && offsetX > 40) {
          this.prevPage();
        } else if (time < 500 && offsetX < -40) {
          this.nextPage();
        } else {
          this.toggleTitleAndMenu();
        }
        // 阻止页面流动
        event.preventDefault();
        event.stopPropagation();
      });
    },
    parseBook() {
      //获取封面图
      this.book.loaded.cover.then((cover) => {
        this.book.archive.createUrl(cover).then((url) => {
          this.setCover(url);
        });
      });
      //获取电子书的信息（书名，作者等）
      this.book.loaded.metadata.then((metadata) => {
        this.setMetadata(metadata);
      });
      this.book.loaded.navigation.then((nav) => {
        const navItem = flatten(nav.toc);
        //将扁平化的数组加上 level 等级属性
        function find(item, level = 0) {
          return !item.parent
            ? level
            : find(
                navItem.filter(
                  (parentItem) => parentItem.id === item.parent
                )[0],
                ++level
              );
        }
        navItem.forEach((item) => {
          item.level = find(item);
        });
        this.setNavigation(navItem);
      });
    },
    initEpub(url) {
      this.book = new Epub(url);
      //将解析的 book 对象放到 vuex 中
      this.setCurrentBook(this.book);
      this.initRendition();
      // this.initGesture();
      this.parseBook();
      this.book.ready
        .then(() => {
          return this.book.locations.generate(
            750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)
          );
        })
        .then((locations) => {
          // 简单的分页算法
          this.navigation.forEach((nav) => {
            nav.pagelist = [];
          });
          locations.forEach((item) => {
            const loc = item.match(/\[(.*)\]!/)[1];
            this.navigation.forEach((nav) => {
              if (nav.href) {
                // console.log(nav.href);
                let href = []
                if (nav.href.includes('xhtml')) {
                  href = nav.href.match(/^(.*)\.xhtml$/)[1]
                } else if (nav.href.includes('html#')) {
                  href = nav.href.split('#')[0].match(/^(.*)\.html$/)[1]
                } else {
                  href = nav.href.match(/^(.*)\.html$/)[1]
                }
                if (href === loc) {
                  nav.pagelist.push(item);
                }
              }
            });
            let currentPage = 1;
            this.navigation.forEach((nav, index) => {
              if (index === 0) {
                nav.page = 1;
              } else {
                nav.page = currentPage;
              }
              currentPage += nav.pagelist.length + 1;
            });
          });
          // console.log(this.navigation);
          // console.log(locations);
          this.setPagelist(locations)
          this.setBookAvailable(true);
          this.refreshLocation();
        });
    },
  },
  mounted() {
    const books = this.$route.params.fileName.split("|")
    const fileName = books[1]
    getLocalForage(fileName, (err, blob) => {
      if (!err && blob) {
        console.log('离线阅读');
        this.setFileName(books.join('/')).then(() => {
          this.initEpub(blob)
        })
      } else {
        console.log('在线阅读');
        this.setFileName(books.join('/')).then(() => {
          const url =
            `${process.env.VUE_APP_RES_URL}` + "/epub/" + this.fileName + ".epub";
          this.initEpub(url);
        });
      }
    })
  },
};
</script>

<style lang='scss' rel='stylesheet/scss' scoped>
@import "../../assets/styles/global.scss";
.ebook-reader {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
  .ebook-reader-mask {
    position: absolute;
    left: 0;
    top: 0;
    background: transparent;
    z-index: 150;
    width: 100%;
    height: 100%;
  }
}
</style>