[TOC]



# vue-imooc-ebook-app



### 项目截图：

<img src="https://shulao-1308350433.cos.ap-guangzhou.myqcloud.com/pictures/1.png" alt="1" style="zoom:50%;width:200px;" /><img src="https://shulao-1308350433.cos.ap-guangzhou.myqcloud.com/pictures/2.png" alt="2" style="zoom:50%;width:200px;" /><img src="https://shulao-1308350433.cos.ap-guangzhou.myqcloud.com/pictures/4.png" alt="4" style="zoom:50%;width:200px;" />



### 项目在线体验（online）

http://ebookapp.shulaoya.fun:5432/



#### 静态资源（用于nginx 动静分离加速访问，如果选择接口访问则这步可以忽略）

------

##### 资源自取

包含主题样式、图片、电子书云盘需要自取（资源比较大，几个G）：
book 文件夹：Theme 主题样式
epub 电子书：epub 电子书资源
epub2 电子书：电子书详情（各章节及相应的照片）
fonts 文件夹：字体样式

链接: https://pan.baidu.com/s/1_hdROkV6bVEvqfPFwvKWOg  提取码: yjmq



##### nginx 代理服务

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



#### 接口访问

------

若不想下载占内存可以直接使用线上的资源，需要在.env.development文件里面去配置，将接口统一成 http://47.99.166.157，忽略一下 nginx 代理服务配置，直接下载依赖启动就可以使用啦！



【小bug】听书功能页面会有几个小bug：
（1）点击暂停语音还在播放 
（2）电子书音频时长及当前音频进度不显示
（3）电子书书架的分组中，选中图书点击移出分组过渡动画没有实现

还有待后续解决，觉得好玩的、不好的欢迎吐槽、闲聊 ~



## Project setup

```
npm install

npm run serve

npm run build

npm run lint
```
