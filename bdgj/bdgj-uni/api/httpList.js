/**
 * 获取发现好商品接口
 * @param  {[url]} 地址
 * @return {[type]}  请求方式
 */

let httpList = {
	/**
	 * 小程序发送模板消息
	 */
	//微信
	'wxminiSendMessage': {
		url: '/uc/template/api/wxmini'
	},
	//支付宝
	'aliminiSendMessage': {
		url: '/uc/template/api/alimini'
	},
	//获取当前订单的成员分类信息
	p_queryInsureders: {
		"url": "/policy/wtPolicys/api/queryInsureders"
	},
	//获取小程序用户信息
	p_WX_userInfo: {
		"url": "/uc/login/thirdOauthBaseInfo"
	},

	//绑定小程序手机号
	p_xcx_BDMobile: {
		"url": "/uc/login/phoneRegister"
	},
	//获取成员分类列表
	P_bind_newRelations: {
		url: '/uc/ucUser/api/relations',
		type: 'post'
	},

	//获取保单统计数据
	P_policyCount: {
		url: '/policy/wtPolicys/api/policyCount',
		type: 'post'
	},

	//获取保单列表
	P_policyList: {
		url: '/policy/V4_4/api/list',
		type: 'post'
	},

	// 保险种类保单统计
	P_classifyPolicyCount: {
		url: '/policy/wtPolicys/api/classifyPolicyCount',
		type: 'post'
	},

	// 查询被邀请用户
	P_policyQuery: {
		url: '/policy/wtPolicys/api/queryShareUser',
		type: 'post'
	},

	// 獲取我的家庭成員
	P_policyIsSared: {
		url: '/policy/wtPolicys/api/iShared',
		type: 'post'
	},

	//获取手机验证码
	getPhoneCode: {
		type: 'post'
	},

	//绑定手机号
	BDMobile: {
		url: "/uc/login/phoneRegister",
		type: 'post'
	},

	//快速理赔
	P_claimsDetail: {
		url: "/policy/policy/api/policyDetailByPolicyNo",
		type: 'post'
	},

	//提交理赔申请
	P_addClaim: {
		url: "/policy/claimSettle/api/addClaim",
		type: 'post'
	},

	//查询我邀请的用户
	P_policyIsSared: {
		url: '/policy/wtPolicys/api/iShared'
	},

	//删除分享用户
	P_removePolicyShare: {
		url: '/policy/wtPolicys/api/removePolicyShare'
	},

	//评价商品

	P_addComment: {
		url: '/policy/insuranceProductComment/api/addComment'
	},

	//保障权益-订单
	P_orderInterest: {
		url: '/policy/orderInterest/api/list',
	},
	//保障权益-保单
	P_policyInterest: {
		url: '/policy/wtPolicys/api/queryGuaratees',
	},

	// 保单中心 保单详情 
	P_wtPolicyDetail: {
		url: '/policy/wtPolicys/api/detail',
	},

	//绑定投保人关系
	P_buildMember: {
		url: '/uc/ucUser/relations/build',
		type: 'post'
	},

	//保险种类保单查询
	P_classifyPolicy: {
		url: '/policy/V4_4/api/classifyPolicy'
	},

	//查询成员接口新
	P_bind_newRelations: {
		url: '/uc/ucUser/api/relations',
	},

	//分享保单
	P_policyShare: {
		url: '/policy/wtPolicys/api/policyShare'
	},
	//保单邀请
	acceptPolicyShare: {
		url: '/policy/wtPolicys/api/acceptPolicyShare'
	},

	//客服电话 手机号
	app_customerService: {
		url: "/app/infoConfig/api/getInfoByCode"
	},

	//下载电子保单
	P_verifyBdurlExist: {
		url: '/tools/bdurl/api/verifyBdurlExist',
	},
	minplatRegister: {
		url: '/uc/login/api/minplatRegister',
	},

	//个人有效保单总数
	p_validPolicy: {
		url: '/policy/wtPolicys/api/validPolicy',
	},

	//个人三个月待支付保单
	p_needPayPolicy: {
		url: '/policy/wtPolicys/api/needPayPolicy',
	},

	//今年家庭总保单数
	p_yearPayPolicy: {
		url: '/policy/wtPolicys/api/yearPayPolicyUnion',
	},

	//获取全部保单
	get_allPolicy: {
		url: '/policy/V4_4/api/unionlist',
	},
	// 理赔进度
	c_progress: {
		url: '/policy/claimSettle/api/myClaim'
	},
	// 获取绑定保单验证码
	// b_getCode: {
	//     url: '/captcha/send/captext'
	// },
	// 绑定保单
	b_bindPolicy: {
		url: '/policy/keeper/api/bindPolicy'
	},
	// 加保权益
	P_addPolicy: {
		url: '/policy/wtPolicys/api/addPolicyGuaratees'
	},
	// 保单验真
	v_policy: {
		url: '/policy/insuranceCompany/api/getAllCompany'
	},
	// 保单分析家庭成员
	i_Analysis: {
		url: '/policy/keeper/list/relations'
	},
	// 保单分析成员保单情况
	i_insure: {
		url: '/policy/keeper/api/insuredSummary'
	},
	// 保单分析成员保额情况
	i_detail: {
		url: '/policy/keeper/api/analysis'
	},
	// 保险顾问
	Exe_agentsList: {
		url: '/wt/policyAgents/api/list',
		type: 'post'
	},
	// 保险顾问详情
	Exe_agentsDetail: {
		url: '/wt/policyAgents/api/detail',
		type: 'post'
	},
	// 保险顾问评论
	Exe_AgentShowComments: {
		url: '/wt/policyAgentComments/api/showComments',
		type: 'post'
	},

	// 保险专家
	Exe_expertsList: {
		url: '/wt/policyExperts/api/list',
		type: 'post'
	},
	// 保险专家详情
	Exe_expertsDetail: {
		url: '/wt/policyExperts/api/detail',
		type: 'post'
	},
	// 预约
	Exe_agentOrder: {
		url: '/wt/wtAgentOrder/appointment',
		type: 'post'
	},
	// 评论
	Exe_agentComments: {
		url: '/wt/policyAgentComments/api/comment',
		type: 'post'
	},
	// 单独传入url
	none: {
		url: ''
	},
	// 理赔详情
	P_claimDetail: {
		url: '/policy/claimSettle/api/claimDetail'
	},
	/**--------------------------- 支付宝小程序相关 ---------------------------*/
	p_ALIPAY_authcode: {
		url: '/uc/login/thirdOauthBaseInfo'
	},
	ali_minplatRegister: {
		url: '/uc/login/api/aliminiRegister'
	}

}

//小程序获取签名

module.exports = httpList;
