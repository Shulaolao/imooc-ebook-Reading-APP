import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store'
import './assets/styles/icon.css'
// import './assets/fonts/daysOne.css'
import '@/assets/styles/global.scss'
import i18n from '@/lang'
// import mock from '@/mock'
import '@/utils/boost'
import '@/utils/create-api'

Vue.config.productionTip = false
Vue.use(router)

new Vue({
  render: h => h(App),
  router,
  store,
  i18n,
  // mock
}).$mount('#app')
