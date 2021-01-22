
/**
 * 微信小程序相关
 */
import http from '../http.js';
import store from '../../store/state';
let wxApi = {
    //判断是否授权
    getSetting() {
        return new Promise((resolve, reject) => {
            uni.getSetting({
                success: res => {
                    //未授权先授权
                    console.log("setting:", res);
                    if (!res.authSetting['scope.userInfo']) {
                        return resolve(false);
                    }
                    return resolve(true);
                },
            });
        }
        );
    },

    //用code获取用户信息
    getuserInfoByCode() {
        return new Promise((resolve, reject) => {
            uni.login({
                provider: 'weixin',
                success: res => {
                    var code = res.code;
                    http.uniRequest({
                        name: 'p_WX_userInfo',
                        intercept: true,
                        data: {
                            authCode: code,
                            serverCode: 'wxminisrdz',
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
            uni.login({
                provider: 'weixin',
                success: res => {
                    var code = res.code;
                    // 直接用code获取用户信息
                    uni.getUserInfo({
                        withCredentials: true,
                        success: userInfo => {
                            //通过对应信息获取用户信息
                            http.uniRequest({
                                name: 'p_WX_userInfo',
                                data: {
                                    iv: userInfo.iv,
                                    encryptedData: userInfo.encryptedData,
                                    authCode: code,
                                    serverCode: 'wxminisrdz',
                                },
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
module.exports = wxApi;