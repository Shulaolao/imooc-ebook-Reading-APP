// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })

function mock(app, url, data) {
  app.get(url, (request, response) => {
    response.json(data)
  })
}

const homeData = require('./src/mock/bookHome')
const shelfData = require('./src/mock/bookShelf')
const listData = require('./src/mock/bookList')
const flatListData = require('./src/mock/bookFlatList')

module.exports = {
  baseUrl: process.env.NODE_ENV === 'production' ? './' : '/',
  devServer: {
    port: 5432,
    before(app) {
      mock(app, '/book/home', homeData)
      mock(app, '/book/shelf', shelfData)
      mock(app, '/book/list', listData)
      mock(app, '/book/flat-list', flatListData)
    },
    proxy: {
      '/': {
        target: 'http://47.99.166.157',
        changeOrigin: true,
        ws: false
      }
    },
    allowedHosts: [
      'ebookapp.shulaoya.fun'
    ]
  },
  //关闭eslint 校验
  // eslint: false,
  lintOnSave: false
}
