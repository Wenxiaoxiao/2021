
/**
 * 获取发现好商品接口
 * @param  {[url]} 地址
 * @return {[type]}  请求方式
 */

let httpList = {
     /**
     * 小程序发送模板消息
     */
	// token
	'getLoginInfo': {
        url: '/api/index/wxAppletLogin.do',
		domain: 'zb'
	},
    // 直播课堂
	'getClassDetail': {
		url: '/api/course/info.do',
		type: 'get',
		domain: 'zb'
    },
    // 预约直播
    subscribeClass: {
        url: '/api/course/subscribe.do',
        type: 'post',
		domain: 'zb'
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
	},
	// 发送消息
	'sendChat': {
        
	}
};

module.exports = httpList;
