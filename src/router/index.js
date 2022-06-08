import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component: () => import('@/views/store/StoreShelf.vue'),
            name: 'shelf',
            redirect: '/store/shelf'
        },
        {
            path: '/ebook',
            meta: {index: 0},
            component: () => import('@/views/ebook/index.vue'),
            redirect: '/ebook',
            children: [
                {
                    path: ':fileName',
                    meta: {index: 4},
                    component: () => import('@/components/ebook/EbookReader.vue')
                }
            ]
        },
        {
            path: '/store',
            component: () => import('@/views/store/index.vue'),
            redirect: '/store/shelf',
            meta: {index: 0},
            children: [
                {
                    path: 'shelf',
                    meta: {index: 1},
                    component: () => import('@/views/store/StoreShelf.vue')
                },
                {
                    path: 'home',
                    meta: {index: 2},
                    component: () => import('@/views/store/StoreHome.vue')
                },
                {
                    path: 'list',
                    meta: {index: 3},
                    component: () => import('@/views/store/StoreList.vue')
                },
                {
                    path: 'category',
                    meta: {index: 2},
                    component: () => import('@/views/store/StoreCategory.vue')
                },
                {
                    path: 'detail',
                    meta: {index: 4},
                    component: () => import('@/views/store/StoreDetail.vue')
                },
                {
                    path: 'speaking',
                    meta: {index: 5},
                    component: () => import('@/views/store/StoreSpeaking.vue')
                }
            ]
        },
    ]
})
