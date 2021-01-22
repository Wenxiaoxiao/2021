# 保单管家小程序项目文档

## 项目介绍
> 对用户保单进行统一管理:

> 主要包括:
>> 1.我的保单服务

>> 2.保单管理列表

>> 3.保障分析

>> 4.查看保单理赔进度

> 主要功能有:
>> 1.成员分类

>> 2.快速理赔

>> 3.查看保单

>> 4.评价商品

>> 5.查看保单详情

>> 6.添加/管理家庭成员


## 技术选择
- 使用uni-app框架



## 项目结构
```
├── api
	├── filter.js                       // 过滤器
	├── http.js                         // 公共请求方法
	├── httpList.js                     // 请求接口列表
	├── notice.js    					// 提示与加载工具类
	├── tools.js    					// 公用工具函数
	├── utils.js    					// 公用功能函数
├── assets								// 静态资源			
├── components							// vue组件			
├── iconfont							// 字体图标			
├── image								// 公用图片资源		
├── less								// 样式				
├── pages								// vue页面	
├── unpackage							// 打包产出目录
	├── dev								// 测试环境
		├── alipay                      // 支付宝小程序代码
		├── baidu                       // 百度小程序代码
		├── wx                          // 微信小程序代码
	├── build							// 正式环境
		├── alipay                      
		├── baidu                       
		├── wx                          
├── App.vue                             // vue主页面
├── main.js                             // vue入口文件
├── pages.json							// 路由配置
├── manifest.json                       // 项目的配置文件

```

## 账户信息
```
//保单管家相关
<!-- 微信小程序 -->
wutongshu0715@126.com  
wuts0715
appid: wx647f23f59d34653e
AppSecret: ba9178bdf9d013207cae9eb7baf80cda

<!-- 支付宝小程序 -->
支付宝生活号-梧桐树保险网  
wutongshu156@126.com  
wuts0715
appid: 2019091767426879


//蜡烛宝贝相关  
账号：wutongshu7788@163.com  
密码：wuts0715

appid:wxcf6de2f6fc4c5fd7
AppSecret：bad10308f674b89246e2dce0b80a2ced
```

## 注意事项
- 小程序相关资源引用对外链引用较为优化,个人建议资源引用为外链
- 上传需注意appId以及环境切换




//欢拓云
合作方ID：12452
账号：梧桐树保险
密码：wutongshu
