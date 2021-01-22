/**
 * 获取发现好商品接口
 * @param  {[url]} 地址
 * @return {[type]}  请求方式
 */

let httpList = {
    /**
     * 小程序发送模板消息
     */
    'login.wxminiSendMessage': {
        url: '/uc/template/api/wxmini',
        type: 'post'
    },
    /**
     * 支付宝发送模板消息
     */
    'template.alimini': {
        url: '/uc/template/api/alimini',
        type: 'post'
    },
    
    /**
     * 通过微信用户信息获取token
     */
    'login.minplatAuth': {
        url: '/uc/login/thirdOauthBaseInfo',
        type: 'post'
    },
    /**
     *  通过微信用户信息 手机号绑定
     */
    'login.minplatRegister': {
        url: '/uc/login/api/minplatRegister',
        type: 'post'
    },
    /**
     *  通过支付宝用户信息 手机号绑定
     */
    'login.aliminiRegister': {
        url: '/uc/login/api/aliminiRegister',
        type: 'post'
    },
    /**
     * 获取定制活动倒计时间
     * @param key 写死
     */
    'caculate.getInfo': {
        // url: '/fsservers/activies/api/active?key=1560932021781',
        url: '/fsservers/activies/api/active',
        type: 'post'
    },
    /**
     * 获取定制活动列表
     * @param 无
     */
    'custom.plan': {
        url: '/fsservers/servers/api/list',
        // url: '/fsservers/servers/api/list?type=1',
        type: 'post'
    },
    /**
     * 定制下单
     * @param id 定制的id
     * @param consumeName 客户姓名
     * @param mobile 手机号
     * @param openActivity 产品活动有没有结束
     */
    'custom.beginOrder': {
        // url: '/fsservers/serversOrder/api/beginOrder:id',
        url: '/custom/personal/api/beginOrder/:id',
        type: 'post'
    },
    /**
     * 获取验证码
     * @param phone 手机号
     */
    'captcha.send': {
        url: '/captcha/send/captext',
        type: 'get'
    },

    /**
     * 订单详情
     * @param id 订单号
     */
    'custom.detail': {
        url: '/custom/personal/api/detail/:id',
        type: 'post'
    },
    /**
     * 我的定制列表
     * @param payStatus 1 写死
     * @param planType 0 写死
     */
    'custom.orders': {
        // url: '/fsservers/serversOrder/api/orders',
        url: '/fsservers/serversOrder/api/orders',
        type: 'post'
    },
}

//小程序获取签名

module.exports = httpList