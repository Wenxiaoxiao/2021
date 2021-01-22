import http from '../../../api/http';
import store from '../../../store';
import cml from 'chameleon-api';

class Method implements UtilInterface {
    makingCall(tel) {
        console.log(tel);
        if (tel) {
            my.makePhoneCall ({
                number: tel
            });
        } else {
            http ({
                name: 'app_customerService',
                data: {code: 'customerService'},
            })
            .then (data => {
                if (!data) return;
                store.state.KFPhoneNumber = data.data[0].phoneNumber;
                my.makePhoneCall ({
                    number: store.state.KFPhoneNumber
                });
            })
            .catch (error => {
                console.log (error);
            });
        }
    }

    //暂时不用
    downloadFile(url) {
        
    }

    //暂时不用
    openDocument(filePath) {
        
    }

    login(url, que) {
        let query = {path: url || ''};
        if (que) {
            query = Object.assign (query, que);
        }
        return new Promise ((resolve, reject) => {
            let scopes = 'auth_base';
            my.getAuthCode({
                scopes,
                success: (res) => {
                    let code = res.authCode;
                    http({
                        name: 'p_ALIPAY_authcode',
                        intercept:true,
                        data: {
                            authCode: code,
                            serverCode: 'alpmini',
                            scope: scopes
                        }
                    }).then(data => {
                        if (data.httpCode == 303)
                        {
                            return cml.redirectTo ({
                                path: '/pages/authorizationPage/authorizationPage',
                                query: query
                            });
                        }
                        if(!data.data || !data.data.unionid)
                        {
                            return cml.redirectTo ({
                                path: '/pages/authorizationPage/authorizationPage',
                                query: query,
                            });
                        }
                        store.state.WTS_USER_XCX = data.data;
                        store.state.token = data.token;
                        return resolve (data.data);
                    });
                }
            });
        });
    }

    getSetting() {
        return new Promise ((resolve, reject) => {
            my.getSetting ({
                success: res => {
                    console.log('哈哈',res);
                    //未授权先授权
                    if (!res.authSetting['scope.userInfo']) {
                        return resolve (false);
                    }
                    return resolve (true);
                },
            });
        });
    }

    getPlatformUserInfo() {
        return new Promise ((resolve, reject) => {
            //已授权直接获取用户信息
            my.getAuthCode ({
                success: res => {
                    var code = res.authCode;
                    // 直接用code获取用户信息
                    my.getOpenUserInfo ({
                        success: res => {
                            //通过对应信息获取用户信息
                            let userInfo = JSON.parse(res.response).response;
                            http ({
                                name: 'p_ALIPAY_authcode',
                                data: Object.assign({}, userInfo, {
                                    authCode: code,
                                    serverCode: 'alpmini',
                                    scope:'auth_openuser'
                                })
                            })
                            .then (data => {
                                if (!data) return;
                                store.state.WTS_USER_XCX = data.data;
                                store.state.token = data.token;
                                return resolve (data.data);
                            })
                            .catch (error => {
                                console.log (error);
                            });
                        }
                    });
                },
            });
        });
    }

    getAliPhoneNumber() {
        return new Promise((resolve, reject) => {
            my.getPhoneNumber({
                success: (res) => {
                    let encryptedData = res.response;
                    resolve(encryptedData);
                },
                fail: (res) => {
                    console.log(res);
                    console.log('getPhoneNumber_fail');
                }
            });
        });
    }

    canIUse(str){
        return my.canIUse(str);
    }

    showLoading(option) {
        let {
            title = '加载中...',
            mask = false,
            success = function () {},
            fail = function () {},
        } = option;
        my.showLoading ({
            content: title,
            success,
            fail
        });
    }

    hideLoading() {
        my.hideLoading({
            success: function(){

            }
        });
    }

    getUpdateManager(){
        return my.getUpdateManager();
    }

    hideMenu(){
        
    }

    getOsInfo(){
        return  {
          os:"xcx_alipay",
          version:"1.2.7"
        }
    }

    //影藏分享按钮
    hideShareMenu(){
        if (my.canIUse('hideShareMenu')) {
            my.hideShareMenu();
        } else {
            my.alert({
               title: '提示',
               content: '当前支付宝版本过低，无法使用此功能，请升级最新版本支付宝'
            });
        }
    }

    showModal (option = {}) {
        let {
          title = '温馨提示',
          content = '这是一个模态弹窗',
          success = function(res){
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        } = option;
        my.confirm({
          title,
          content,
          success
        })
    }

    showToast(option = {}){
        let {
          title = "成功",
          duration = 1500,
          icon = 'none'
        } = option;
        my.showToast({
          content: title,
          duration,
          type: icon
        });
    }
}

export default Method;