
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

项目大概成品：![image](https://img-blog.csdnimg.cn/img_convert/1b2ea4a7f1ca3040e32fa0192c1ac5ba.png)

以下电子书及一些静态资源云盘自取（资源比较大）：
book 文件夹：Theme 主题样式
epub 电子书：epub 电子书资源
epub2 电子书：电子书详情（各章节及相应的照片）
fonts 文件夹：字体样式

链接: https://pan.baidu.com/s/1_hdROkV6bVEvqfPFwvKWOg 提取码: yjmq
若不想下载占内存可以直接使用线上的资源，需要在.env.development文件里面去配置，将接口统一成 http://47.99.166.157，忽略一下 nginx 代理服务配置，直接下载依赖启动就可以使用啦！

nginx 代理服务：
电子书等静态资源下载到本地后，资源要开启 nginx 代理服务，到 nginx>conf 文件夹下开一个监听端口（这里我的静态资源是在 resource文件夹)：
添加代码（这里开启了8081 端口）：

```javascript
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
```
    
如果在浏览器输入本地ip+端口号能和成功展示资源的话就表示成功部署了nginx 静态资源：
![image](https://img-blog.csdnimg.cn/img_convert/793060900c55ed046189d1979e64076c.png)

【小bug】听书功能页面会有几个小bug：
（1）点击暂停语音还在播放 
（2）电子书音频时长及当前音频进度不显示
（3）电子书书架的分组中，选中图书点击移出分组过渡动画没有实现

这些问题，还有待后续解决，欢迎各位喜欢技术的小伙伴探讨

如果觉得项目不错，可以给个 star 呀~

