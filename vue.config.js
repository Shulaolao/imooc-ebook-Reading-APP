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
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  devServer: {
    before(app) {
      mock(app, '/book/home', homeData)
      mock(app, '/book/shelf', shelfData)
      mock(app, '/book/list', listData)
      mock(app, '/book/flat-list', flatListData)
    }
  },
  //关闭eslint 校验
  // eslint: false,
  lintOnSave: false,
  // devServer: {
  //   //配置自动打开浏览器时的本地端口
  //   host: '192.168.1.216',
  // }
}
