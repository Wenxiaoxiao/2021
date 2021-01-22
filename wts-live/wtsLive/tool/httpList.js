
/**
 * 获取发现好商品接口
 * @param  {[url]} 地址
 * @return {[type]}  请求方式
 */

let httpList={
	// 登录
	'login': {        
		url: '/api/index/wxAppletLogin.do',
	},
	// 发送消息
	'sendChat': {
        url: '/api/message/applet/send.do'
	},
	// 订阅课程
	'subscribeClass': {
		url: '/api/course/subscribe.do'
	},
	// 课程详情
	'getClassDetail': {
		url: '/api/course/info.do',
		type: 'get'
	},
	// 直播信息
	'getLiveInfo': {
		url: '/api/room/info.do',
		type: 'get'
	},
	// 聊天消息
	'getMessages': {
		url: '/api/message/list.do',
		type: 'get'
	}
}

//小程序获取签名

module.exports = httpList;
