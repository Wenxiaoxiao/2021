
/**
 * 支付宝小程序相关
 */
import http from '../http.js';
import store from '../../store/state';
let zfbApi={
    //判断是否授权
    getSetting() {
        return new Promise((resolve, reject) => {
            my.getSetting ({
	            success: res => {
	                console.log('getSetting',res);
	                //未授权先授权
	                if (!res.authSetting['userInfo']) {
	                    return resolve (false);
	                }
	                return resolve (true);
	            },
	        });
        }
        );
    },

    //用code获取用户信息
    getuserInfoByCode() {
        return new Promise((resolve, reject) => {
            my.getAuthCode({
	            scopes: "auth_base",
                success: res => {
                    var code = res.authCode;
                    http.uniRequest({
                        name: 'p_WX_userInfo',
                        intercept: true,
                        data: {
                            scope: 'auth_base',
                            authCode: code,
                            serverCode: 'alpminisrdz'
                        },
                    })
                        .then(data => {
                            var gotoSetting = false;
                            if (data.httpCode == 303 || data.httpCode == 402 || data.httpCode == 401) {
                                // 未登录成功
                                gotoSetting = true;
                            }
                            if (!data.data || !data.data.unionid) gotoSetting = true;
                            //判断是否有授权
                            if (gotoSetting) {
                                return this.getSetting().then(flag => {
                                    if (!flag) {
                                        store.login = false;
                                        resolve(false);
                                        return;
                                    }
                                    this.getPlatformUserInfo().then(res => {
                                        resolve(res);
                                    }).catch(e => {
                                        store.login = false;
                                        reject(e);
                                        return;
                                    });
                                });
                            }
                            store.WTS_USER = data.data;
                            store.token = data.token;
                            store.login = true;
                            resolve(data.data);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                },
                fail: res => {
                    console.log(res);
                }
            });
        }
        );
    },


    getPlatformUserInfo() {
        return new Promise((resolve, reject) => {
            my.getAuthCode ({
                success: res => {
                    var code = res.authCode;
                    // 直接用code获取用户信息
                    my.getOpenUserInfo ({
                        success: userInfores => {
                            //通过对应信息获取用户信息
                            let userInfo = JSON.parse(userInfores.response).response;
                            http.uniRequest({
                                name: 'p_WX_userInfo',
                                data: Object.assign({}, userInfo, {
	                                authCode: code,
	                                serverCode: 'alpminisrdz',
	                                scope:'auth_openuser'
	                            })
                            })
                                .then(data => {
                                    if (!data || !data.data) {
                                        return reject();
                                    }
                                    store.WTS_USER = data.data;
                                    store.token = data.token;
                                    store.login = true;
                                    resolve(data.data);
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        },
                    });
                },
            });
        });
    },
};
module.exports = zfbApi;