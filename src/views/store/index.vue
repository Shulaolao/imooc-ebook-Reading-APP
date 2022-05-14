<template>
  <div class="store">
    <transition :name="transitionName">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      transitionName: "slide-left",
    };
  },
  watch: {
    // $route(to, from) {
    //   if (to.meta.index < from.meta.index) {
    //     this.transitionName = "slide-right";
    //   } else {
    //     this.transitionName = "slide-left";
    //   }
    // },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // console.log(to.query);
      if (to.query.key) {
        vm.menuIndex = parseInt(to.query.key);
      }
    });
  },
  beforeRouteUpdate(to, from, next) {
    if (to.meta.index > from.meta.index) {
      this.transitionName = "slide-left";
    } else {
      this.transitionName = "slide-right";
    }
    next();
  },
};
window.onload = function () {
  document.addEventListener("touchstart", function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  });
  document.addEventListener("gesturestart", function (event) {
    event.preventDefault();
  });
};
</script>

<style lang='scss' scoped>
@import "@/assets/styles/global.scss";
.store {
  width: 100%;
  height: 100%;
  background: white;
}
</style>