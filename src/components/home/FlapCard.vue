<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div
      class="flap-card-bg"
      v-show="runFlapCardAnimation"
      :class="{ animation: runFlapCardAnimation }"
    >
      <div
        class="flap-card"
        v-for="(item, index) in flapCardList"
        :key="index"
        :style="{ zIndex: item.zIndex }"
      >
        <div class="flap-card-circle">
          <div
            class="flap-card-semi-circle flap-card-semi-circle-left"
            :style="semiCircleStyle(item, 'left')"
            ref="left"
          ></div>
          <div
            class="flap-card-semi-circle flap-card-semi-circle-right"
            :style="semiCircleStyle(item, 'right')"
            ref="right"
          ></div>
        </div>
      </div>
      <div class="point-wrapper">
        <div
          class="point"
          :class="{ animation: runPointAnimation }"
          v-for="item in pointList"
          :key="item"
        ></div>
      </div>
    </div>
    <div
      class="book-card"
      :class="{ animation: runBookCardAnimation }"
      v-show="runBookCardAnimation"
    >
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img :src="data ? data.cover : ''" class="img" />
        </div>
        <div class="content-wrapper">
          <div class="content-title">{{ data ? data.title : "" }}</div>
          <div class="content-author sub-title-medium">
            {{ data ? data.author : "" }}
          </div>
          <div class="content-category">{{ getCategoryText() }}</div>
        </div>
        <div class="read-btn" @click.stop="showBookDetail(data)">
          {{ $t("home.readNow") }}
        </div>
      </div>
    </div>
    <div class="close-btn-wrapper">
      <span class="icon-close" @click="hideFlapCard"></span>
    </div>
  </div>
</template>

<script>
import { storeHomeMixin } from "@/utils/mixin";
import { flapCardList, categoryText } from "@/utils/store";
export default {
  mixins: [storeHomeMixin],
  data() {
    return {
      flapCardList,
      front: 0,
      back: 1,
      interValTime: 30,
      runFlapCardAnimation: false,
      pointList: null,
      runPointAnimation: false,
      runBookCardAnimation: false,
    };
  },
  props: {
    data: Object,
  },
  watch: {
    flapCardVisible(flapCardVisible) {
      if (flapCardVisible) {
        this.runAnimation();
      }
    },
  },
  methods: {
    getCategoryText() {
      if (this.data) {
        return categoryText(this.data.category, this);
      } else {
        return "";
      }
    },
    semiCircleStyle(item, dir) {
      return {
        backgroundColor: `rgb(${item.r}, ${item.g}, ${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: dir === "left" ? item.imgLeft : item.imgRight,
      };
    },
    hideFlapCard() {
      this.setFlapCardVisible(false);
      this.stopAnimation();
      this.$emit("resetBook");
    },
    rotate(index, type) {
      const item = this.flapCardList[index];
      let dom;
      if (type === "front") {
        dom = this.$refs.right[index];
      } else {
        dom = this.$refs.left[index];
      }
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`;
      dom.style.backgroundColor = `rgb(${item.r}, ${item._g}, ${item.b})`;
    },
    // flapCardRotate() {
    //     const frontFlapCard = this.flapCardList[this.front]
    //     const backFlapCard = this.flapCardList[this.back]
    //     frontFlapCard.rotateDegree += 10
    //     frontFlapCard._g -= 5
    //     backFlapCard.rotateDegree -= 10
    //     if (backFlapCard.rotateDegree < 90) {
    //         backFlapCard._g += 5
    //     }
    //     if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
    //         backFlapCard.zIndex += 2
    //     }
    //     this.rotate(this.front, 'front')
    //     this.rotate(this.back, 'back')
    //     if ( frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
    //         this.next()
    //     }
    // },
    // next() {
    //     const frontFlapCard = this.flapCardList[this.front]
    //     const backFlapCard = this.flapCardList[this.back]
    //     frontFlapCard.rotateDegree = 0
    //     backFlapCard.rotateDegree = 0
    //     frontFlapCard._g = frontFlapCard.g
    //     backFlapCard._g = backFlapCard.g
    //     this.rotate(this.front, 'front')
    //     this.rotate(this.back, 'back')
    //     this.front++
    //     this.back++
    //     const len = this.flapCardList.length
    //     if (this.front >= len) {
    //         this.front = 0
    //     }
    //     if (this.back >= len) {
    //         this.back = 0
    //     }
    //     // 动态设置 zindex
    //     // 100 -> 96
    //     // 99 -> 100
    //     // 98 -> 99
    //     // 97 -> 98
    //     // 96 -> 97
    //     // (0-1+5) % 5 = 4
    //     // (1-1+5) % 5 = 0
    //     this.flapCardList.forEach((item, index) => {
    //         item.zIndex = 100 - ((index - this.front + len) % len)
    //     })
    //     this.prepare()
    // },
    // prepare() {
    //     const backFlapCard = this.flapCardList[this.back]
    //     backFlapCard.rotateDegree = 180
    //     backFlapCard._g = backFlapCard.g - 5 * 9
    //     this.rotate(this.back, 'back')
    // },
    // startFlapCardAnimation() {
    //     this.prepare()
    //     this.task = setInterval(() => {
    //         this.flapCardRotate()
    //     }, this.interValTime)
    // },
    // stopFlapCardAnimation() {
    //     if (this.task) {
    //         clearInterval(this.task)
    //         this.reset()
    //     }
    // },
    // reset() {
    //     this.front = 0
    //     this.back = 1
    //     this.flapCardList.forEach((item, index) => {
    //         item.zIndex = 100 - index
    //         item._g = item.g
    //         item.rotateDegree = 0
    //         this.rotate(index, 'front')
    //         this.rotate(index, 'back')
    //     })
    // },
    runAnimation() {
      this.runFlapCardAnimation = true;
      this.timeout1 = setTimeout(() => {
        this.startFlapCardAnimation();
        this.startPointAnimation();
      }, 500);
      this.timeout2 = setTimeout(() => {
        this.stopAnimation();
        this.runBookCardAnimation = true;
      }, 2500);
    },
    flapCardRotate() {
      const frontFladCard = this.flapCardList[this.front];
      const backFladCard = this.flapCardList[this.back];
      frontFladCard.rotateDegree -= 10;
      frontFladCard._g -= 5;
      backFladCard.rotateDegree -= 10;
      if (backFladCard.rotateDegree < 90) {
        backFladCard._g += 5;
      }
      if (
        frontFladCard.rotateDegree === -90 &&
        backFladCard.rotateDegree === 90
      ) {
        backFladCard.zIndex += 2;
      }
      this.rotate(this.front, "front");
      this.rotate(this.back, "back");
      if (
        frontFladCard.rotateDegree === -180 &&
        backFladCard.rotateDegree === 0
      ) {
        this.next();
      }
    },
    next() {
      const frontFladCard = this.flapCardList[this.front];
      const backFladCard = this.flapCardList[this.back];
      frontFladCard.rotateDegree = 0;
      backFladCard.rotateDegree = 0;
      frontFladCard._g = frontFladCard.g;
      backFladCard._g = backFladCard.g;
      this.rotate(this.front, "front");
      this.rotate(this.back, "back");
      const len = this.flapCardList.length;
      this.front++;
      this.back++;
      if (this.front >= len) {
        this.front = 0;
      }
      if (this.back >= len) {
        this.back = 0;
      }
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - ((index - this.front + len) % len);
      });
      this.prepare();
    },
    prepare() {
      const backFladCard = this.flapCardList[this.back];
      backFladCard.rotateDegree = 180;
      backFladCard._g = backFladCard.g - 9 * 5;
      this.rotate(this.back, "back");
    },
    stopAnimation() {
      this.runFlapCardAnimation = false;
      if (this.task) {
        clearInterval(this.task);
        this.reset();
      }
      if (this.timeout1 || this.timeout2) {
        clearTimeout(this.timeout1);
        clearTimeout(this.timeout2);
      }
    },
    reset() {
      this.front = 0;
      this.back = 1;
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - index;
        item._g = item.g;
        item.rotateDegree = 0;
        this.rotate(index, "front");
        this.rotate(index, "back");
      });
      this.runBookCardAnimation = false;
      this.runFlapCardAnimation = false;
      this.runPointAnimation = false;
    },
    startPointAnimation() {
      this.runPointAnimation = true;
      setTimeout(() => {
        this.runPointAnimation = false;
      }, 600);
    },
    startFlapCardAnimation() {
      this.prepare();
      this.task = setInterval(() => {
        this.flapCardRotate();
      }, this.interValTime);
    },
  },
  created() {
    this.pointList = [];
    for (let i = 0; i < 18; i++) {
      this.pointList.push(`point${i}`);
    }
  },
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/global.scss";
@import "@/assets/styles/flapCard.scss";
.flap-card-wrapper {
  @include absCenter;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  @include center;
  .flap-card-bg {
    position: relative;
    width: px2rem(64);
    height: px2rem(64);
    border-radius: px2rem(5);
    background: white;
    transform: scale(0);
    opacity: 0;
    &.animation {
      animation: flap-card-move 0.3s ease-in both;
    }
    @keyframes flap-card-move {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
      75% {
        transform: scale(0.9);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    .point-wrapper {
      z-index: 1500;
      @include absCenter;
      .point {
        border-radius: 50%;
        @include absCenter;
        &.animation {
          @for $i from 1 to length($moves) {
            &:nth-child(#{$i}) {
              @include move($i);
            }
          }
        }
      }
    }
    .flap-card {
      width: px2rem(48);
      height: px2rem(48);
      @include absCenter;
      .flap-card-circle {
        display: flex;
        width: 100%;
        height: 100%;
        .flap-card-semi-circle {
          flex: 0 0 50%;
          width: 50%;
          height: 100%;
          background-repeat: no-repeat;
          backface-visibility: hidden;
        }
        .flap-card-semi-circle-left {
          border-radius: px2rem(24) 0 0 px2rem(24);
          background-position: center right;
          transform-origin: right;
        }
        .flap-card-semi-circle-right {
          border-radius: 0 px2rem(24) px2rem(24) 0;
          background-position: center left;
          transform-origin: left;
        }
      }
    }
  }
  .book-card {
    position: relative;
    width: 65%;
    max-height: px2rem(400);
    box-sizing: border-box;
    border-radius: px2rem(15);
    background: white;
    &.animation {
      animation: scale 0.3s ease-in both;
      @keyframes scale {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    }
    .book-card-wrapper {
      width: 100%;
      height: 100%;
      margin-bottom: px2rem(30);
      @include columnTop;
      .img-wrapper {
        width: 100%;
        margin-top: px2rem(20);
        @include center;
        .img {
          width: px2rem(90);
          height: px2rem(130);
        }
      }
      .content-wrapper {
        padding: 0 px2rem(20);
        margin-top: px2rem(20);
        display: flex;
        flex-direction: column;
        padding-bottom: px2rem(15);
        .content-title {
          color: #333;
          font-weight: bold;
          font-size: px2rem(18);
          line-height: px2rem(20);
          max-height: px2rem(40);
          text-align: center;
          @include ellipses2(2);
        }
        .content-author {
          margin-top: px2rem(10);
          text-align: center;
          font-size: px2rem(14);
        }
        .content-category {
          color: #999;
          font-size: px2rem(14);
          margin: px2rem(10) 0;
          text-align: center;
        }
      }
      .read-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1100;
        width: 100%;
        border-radius: 0 0 px2rem(15) px2rem(15);
        padding: px2rem(15) 0;
        text-align: center;
        color: white;
        font-size: px2rem(14);
        background: $color-blue;
      }
    }
  }
  .close-btn-wrapper {
    position: absolute;
    left: 0;
    bottom: px2rem(30);
    z-index: 1100;
    width: 100%;
    @include center;
    .icon-close {
      width: px2rem(45);
      height: px2rem(45);
      border-radius: 50%;
      font-size: px2rem(25);
      background: #333;
      color: white;
      @include center;
    }
  }
}
</style>