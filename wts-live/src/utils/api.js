const ajax = require('./ajax');

var api = function(){
    //直播消息
    this.baseUrl = 'http://zb.wts999.com';
    this.localUrl = 'https://test-zb.lzyunying.com';
    this.prdUrl = 'https://zb.wts999.com';
    // this.prdUrl = 'https://test-zb.lzyunying.com';
}

//登录
api.prototype.login = function(params, success, setStorageSync){
    let defaultParam = params;
    ajax.request({
        url: this.prdUrl + '/api/index/wxAppletLogin.do',
        data: defaultParam,
        method: 'post',
        success: function(loginRes){
            console.log("登录成功");
            if(setStorageSync && typeof setStorageSync == 'function') {
                setStorageSync('loginInfo', loginRes)
            }
            // wx.setStorageSync('token', loginRes.openid);
            // wx.setStorageSync('nickName', loginRes.nickName);
            if (success && typeof success == 'function') {
              success(loginRes);
            }
        }
    })
}

//获取直播室信息
api.prototype.getLiveInfo = function(params, success){
    var defaultParam = params;

    ajax.request({
        url: this.prdUrl + '/api/room/info.do',
        data: defaultParam,
        success: success
    })
}

// 获取直播消息
api.prototype.getMessages = function(params, success){
    var defaultParam = params;

    ajax.request({
        url: this.prdUrl + '/api/message/list.do',
        data: defaultParam,
        success: success
    })
}

//发送直播消息
api.prototype.sendMessage = function(params, success){
    var defaultParam = params;
    ajax.request({
        url: this.prdUrl + '/api/message/send.do',
        data: defaultParam,
        success: success
    });
}

// 发送直播消息（new）
api.prototype.newSendMessage = function(params, success){
    var defaultParam = Object.assign({},{
        userico: ''
    }, params);
    ajax.request({
        url: this.prdUrl + '/api/message/applet/send.do',
        data: defaultParam,
        success: success
    });
}

//获取课程列表信息
api.prototype.getClassList = function(params, success){
    var defaultParam = Object.assign({}, {
        roomId: 1
    }, params);
    ajax.request({
        url: this.prdUrl + '/api/course/list.do',
        data: defaultParam,
        success: success
    });
}

//获取课程详细信息
api.prototype.getClassDetail = function(params, success){
    var defaultParam = Object.assign({}, {
        id: 0,
        roomId: 1
    }, params);
    ajax.request({
        url: this.prdUrl + '/api/course/info.do',
        data: defaultParam,
        success: success
    });
}

//预约课程
api.prototype.subscribeClass = function(params, success){
    var defaultParam = params;
    ajax.request({
        url: this.prdUrl + '/api/course/subscribe.do',
        data: defaultParam,
        method: 'post',
        success: success
    });
}
//听课列表
api.prototype.getVideoList= function(params,success) {
    var defaultParam= params?params:"";
    ajax.request({
        url: this.prdUrl+ '/api/video/list.do',
        data: defaultParam,
        method: 'get',
        success: success
    })
}
// 听课人数增加
api.prototype.addLearner= function(id,success) {
    ajax.request({
        url: this.prdUrl+ '/api/video/playVideo/'+id,
        method: 'get',
        success: success
    })
}
// 保险百科列表
api.prototype.getEncyclopedia= function(success) {
    wx.request({
        url: 'https://bx.wts999.com/app/insuranceBaike/api/typeList',
        method: 'get',
        success: success,
        fail: function(res) {
            console.log(res);
        }
    })
}
// 保险百科词条详情
api.prototype.getEncyclopediaDetail= function(params,success) {
    var defaultParam= params?params:"";
    wx.request({
        url: 'https://bx.wts999.com/app/insuranceBaike/api/getInfoByKeyword',
        data: defaultParam,
        method: 'post',
        success: success
    })
}
// 必读攻略列表
api.prototype.getStrategy= function(success) {
    ajax.request({
        url: this.prdUrl+ '/api/strategy/list.do',
        success: success
    })
}
// 必读攻略详情
api.prototype.getStrategyDetail= function(id,success) {
    ajax.request({
        url: this.prdUrl+ '/api/strategy/info.do/'+id,
        success: success
    })
}
module.exports = new api();