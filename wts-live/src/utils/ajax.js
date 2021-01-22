function request(opt){
    var loginInfo = wx.getStorageSync("loginInfo");
    wx.showNavigationBarLoading();
    wx.request({
        method: opt.method || 'GET',
        url: opt.url,
        data: opt.data,
        header: {
            token: loginInfo.token
        },
        success: function(res){
            if(res.statusCode == 200)
            {
                if (res.data.status == 1) {
                    if (opt.success) {
                        opt.success(res.data.data);
                    }
                }
                //绕过登录
                // else if(res.data.status == 0){
                //     if (opt.success) {
                //         opt.success(res.data.data);
                //     }
                // }
                // else if (res.data.code == 5004) {
                //     console.log("remove invalid token")
                //     wx.removeStorageSync("token")
                //     login();
                // } 
                else {
                    console.warn(res.data);
                    wx.showModal({
                        content: res.data.errmessage,
                        showCancel: false
                    })
                }
            }
            else
            {
                console.error(res);
                wx.showModal({
                    title: '微信异常',
                    showCancel: false
                })
            }
        },
        fail: function (res) {
            console.log(res);
            wx.showModal({
              content: '远程连接失败',
              showCancel: false
            })
        },
        complete: function () {
            wx.hideNavigationBarLoading();
            wx.hideLoading()
        }
    });
}

function login(){
    wx.reLaunch({
        url: '/pages/index/index',
    })
}

module.exports = {
    request
}