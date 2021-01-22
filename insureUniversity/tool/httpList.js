
/**
 * 获取发现好商品接口
 * @param  {[url]} 地址
 * @return {[type]}  请求方式
 */

let httpList={
     /**
     * 小程序发送模板消息
     */
	// 微信token
	'getLoginInfo': {
        url: '/miniLogin',
		type: 'get',
		domain: 'live'
	},
	// 头条token
	'getTtLoginInfo': {
        url: '/miniTTLogin',
		type: 'get',
		domain: 'live'
	},
	//微信支付
	'index_wxpay':{
		url: '/getPaySign',
		type: 'get',
		domain: 'live'
	},
	// 获取顶部按钮
	'index_topList': {
        url: '/homepage/button/list.do',
		type: 'get',
		domain: 'live'
	},
	// 方案设计列表
	'plan_list': {
        url: '/homepage/plan/list.do',
		type: 'get',
		domain: 'live'
	},
	// 课程学习
	'getVideoList': {
		url: '/video/list.do',
		type: 'get',
		domain: 'live'
	},
	// 直播课堂
	'getClassDetail': {
		url: '/course/info.do',
		type: 'get',
		domain: 'live'
	},
	// 顶部banner图及底部链接
	'index_banner': {
        url: '/homepage/banner/detail.do',
		type: 'get',
		domain: 'live'
	},
	// 投保攻略/产品评测文章列表
	'Share_bodyList': {
        url: '/app/articleCategory/api/article/list',
		domain: 'bx'
	},
	// 守护平凡列表
	'gaurd_list': {
        url: '/app/articleCategory/api/article/list',
		domain: 'wts'
	},
	// 保险百科
	'bk_typeList': {
        url: '/app/insuranceBaike/api/voList',
		type: 'get',
		domain: 'bx'
	},
	// 保险百科词条内容
	'getInfoByKeyword': {
        url: '/app/insuranceBaike/api/getInfoById',
		domain: 'bx'
	},
	//问答-顶部tap
	'C_topList': {
		url: '/app/common/api/dic?type=sqPostType',
		type: "get",
		domain: 'bx'
	},
	//超市文章列表
	'C_mainpost': {
		url: '/app/sq/mainpost/api/type',
		params: {},
		type: "get",
		domain: 'bx'
	},
	//超市问答详情
	'answerDetail': {
		url: '/app/sq/mainpost/api/detail',
		type: "get",
		domain: 'bx'
	},
	// 课程学习播放人数
	// 'addLearner': {
 //        url: '/video/playVideo/'+id,
 //        type: 'get',
	// },
	// 课程列表
	'getVideoList': {
		url: '/video/list.do',
		type: 'get',
		domain: 'live'
	},
    // 保险顾问
    Exe_agentsList: {
        url: '/wt/policyAgents/api/list',
        type: 'post',
		domain: 'bx'
    },
    // 保险顾问详情
    Exe_agentsDetail: {
        url: '/wt/policyAgents/api/detail',
        type: 'post',
		domain: 'bx'
    },
    // 保险顾问评论
    Exe_AgentShowComments: {
        url: '/wt/policyAgentComments/api/showComments',
        type: 'post',
		domain: 'bx'
    },
    // 保险专家
    Exe_expertsList: {
        url: '/wt/policyExperts/api/list',
        type: 'post',
		domain: 'bx'
    },
    // 保险专家详情
    Exe_expertsDetail: {
        url: '/wt/policyExperts/api/detail',
        type: 'post',
		domain: 'bx'
    },
    // 预约顾问
    Exe_agentOrder: {
        url: '/wt/wtAgentOrder/appointment',
        type: 'post',
		domain: 'bx'
    },
    // 评论
    Exe_agentComments: {
        url: '/wt/policyAgentComments/api/comment',
        type: 'post',
		domain: 'bx'
    },
    // 预约直播
    subscribeClass: {
        url: '/course/subscribe.do',
        type: 'post',
		domain: 'live'
    },
	// url附带参数 zb
	'nonezb': {
		url: '',
		type: 'get',
		domain: 'live'
	},
	// url附带参数 bx
	'nonebx': {
		url: '',
		type: 'get',
		domain: 'bx'
	},
	// 直播信息
	'getLiveInfo': {
		url: '/room/info.do',
		type: 'get',
		domain: 'live'
	},
	// 聊天消息
	'getMessages': {
		url: '/msgs',
		type: 'get',
		domain: 'live'
	},
	// 发送消息
	'sendChat': {
		url: '/sendMsg',
		type: 'get',
	    domain: 'live'
	},
	
	//新版本直播对接
	'getLiveRoomInfo': {
		url: '/room',
		type: 'get',
		domain: 'live'
	},
	
	//根据临时token注册用户信息
	'miniRegister': {
		url: '/miniRegister',
		type: 'get',
		domain: 'live'
	},
	
	//获取socket需要的token
	'getminiWSToken': {
		url: '/miniWSToken',
		type: 'get',
		domain: 'live'
	},
	
	//获取讲师相关信息
	'getteacherInfo': {
		url: '/teacher',
		type: 'get',
		domain: 'live'
	},
	//心跳检测
	'miniPing': {
		url: '/miniPing',
		type: 'get',
		domain: 'live'
	},
}

//小程序获取签名

module.exports = httpList;
