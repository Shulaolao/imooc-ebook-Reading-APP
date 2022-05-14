import Vue from 'vue'
import Vuex from 'vuex'
import book from './modules/book'
import getters from '@/store/getters'
import actions from '@/store/actions'
import store from '@/store/modules/store'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        book,
        store
    },
    getters,
    actions
})