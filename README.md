# vue-imooc-ebook

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

book 文件夹：Theme 主题样式

epub 电子书：epub 电子书资源

epub2 电子书：电子书详情（各章节及相应的照片）

fonts 文件夹：字体样式

下载：
git clone 下载到本地，
并开启 nginx 服务，到 nginx>conf 文件夹下开一个监听端口：
添加代码（这里开启了8081 端口）：
    server {
          listen 8081;
          server_name resource;
          root C:/Users/Z/Desktop/resource;
          autoindex on;
          location / {
                add_header Access-Control-Allow-Origin *;
          }
          add_header Cache-Control "no-cache, must-revalidate";
    }
如果在浏览器输入本地ip+端口号能和成功展示资源的话就表示成功部署了nginx 静态资源：
![image](https://user-images.githubusercontent.com/99474694/168407554-764b27f4-65e7-488c-9be8-b4e91b2525a8.png)
