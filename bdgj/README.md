# 保单管家小程序项目文档

## 项目介绍
> 对用户保单进行统一管理:

> 主要包括:
>> 1.我的保单服务

>> 2.保单管理列表

> 主要功能有:
>> 1.成员分类

>> 2.快速理赔

>> 3.查看保单

>> 4.评价商品

>> 5.查看保单详情

>> 6.添加/管理家庭成员


## 技术选择
- 使用变色龙框架(chameleon)
- 官方文档 https://cmljs.org/doc/quick_start/quick_start.html



## 环境
- node >= 8.10.0 npm >= 5.6.0
- 全局安装 chameleon-tool 构建工具 npm i -g chameleon-tool

## 项目结构
```
├── chameleon.config.js                 // 项目的配置文件
├── dist                                // 打包产出目录
  ├── alipay                            // 支付宝小程序代码
  ├── baidu                             // 百度小程序代码
  ├── wx                                // 微信小程序代码
├── mock                                // 模拟数据目录
├── node_modules                        // npm包依赖
├── package.json
└── src                                 // 项目源代码
    ├── app                             // app启动入口
    ├── components                      // 组件文件夹
    ├── pages                           // 页面文件夹
    ├── router.config.json              // 路由配置
    └── store                           // 全局状态管理

```
## 命令
- 创建项目与启动
-  执行 cml init project
-  输入项目名称
- 等待自动执行 npm install 依赖
-  切换到项目根目录执行cml dev
- 运行命令(测试环境调试) cml dev
- 正式环境打包命令 cml build

## 工程配置chameleon.config.js
```
 dev: {
      hot: true,
      console: true
    },
    build: {
      publicPath: `${publicPath}/web`,
      apiPrefix
    }

  publicPath:设置静态资源的线上路径
  apiPrefix:设置api请求前缀
```

```
cml.config.merge({
  platforms: ['web','wx'],
});

platforms:配置当前项目支持的端，该配置决定cml dev和cml build命令启动构建的端，决定cml init命令初始化多态接口和多态组件时只生成相应端代码

```

## 账户信息
```
//保单管家相关
wutongshu0715@126.com  
wuts0715
appid: wx647f23f59d34653e
AppSecret: ba9178bdf9d013207cae9eb7baf80cda



//蜡烛宝贝相关  
账号：wutongshu7788@163.com  
密码：wuts0715

appid:wxcf6de2f6fc4c5fd7
AppSecret：bad10308f674b89246e2dce0b80a2ced
```

## 注意事项
- 小程序相关资源引用对外链引用较为优化,个人建议资源引用为外链
- cml dev运行打包文件默认不压缩(方便调试),开发工具需要取消ES6转ES5
  取消样式不全以及自动混淆,不然运行环境会报错
- 上传需注意appId以及环境切换




174870


<h1 id="vtitle">{{isLive ? '正在直播...' : '未上课'}}({{title}})</h1>
  <wxs module="tools" src="./filter.wxs"></wxs>
  <h1>{{motto}}</h1>
  <!-- #画板模块 -->
  <h2>画板模块</h2>
  
  <!-- #播放模块 -->
  <h2>视频模块</h2>
  <talkfun-media-view 
  showMeidaView="{{showMeidaView}}"
  mediaUrl="{{mediaUrl}}"
  ></talkfun-media-view>

  <!-- #聊天 -->
  <h2>聊天模块</h2>
  <view class="mod-chat-list">
    <!-- 列表 -->
    <ul class="chat-inner">
      <li wx:for="{{chatList}}" wx:key="{{item.xid}}">{{item.nickname}} [{{item.role}}] <em class="msg-it">{{item.msg}}</em> ({{tools.getTime(item.time)}})</li>
    </ul>
    <!-- #发送 -->
    <view class="chat-sender">
      <input bindinput="bindChatIpt" value="{{chatMsg}}" type="text" class="chat-mode"/>
      <button class="submit-chat" bindtap="emitChat">发送</button>
    </view>
  </view>
  
  
  //欢拓云
  合作方ID：12452
  账号：梧桐树保险
  密码：wutongshu
