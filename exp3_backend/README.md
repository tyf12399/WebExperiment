# exp3_frontend

这是实验三的后端API部分，项目使用yarn进行包管理，在项目路径下依次执行
```sh
yarn install
yarn start
```
以启动项目

项目使用3000端口，使用前请确保没有其他服务正在占用该端口或自行指定其他空闲端口

图片拍摄地址获取使用了高德地图提供的api，请自行申请相关apikey并填入`.\apikey.js`中，文件内容样例如下
```javascript
//export the api key
module.exports = Object.freeze({
    AMAP_KEY : "Your Key Here"
});
```
图片保存在`.\image`文件夹下，可能需要自行创建