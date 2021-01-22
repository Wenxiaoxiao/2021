import tools from '../../api/tools.js';
import common from '../../api/common.js';
import store from '../../store';

const data = common["alipay"];
if (data) {
    store.state.serverCode = data.serverCode;
    store.state.WTS_VERSION = data.WTS_VERSION;
    store.state.WTS_ENVIRONMENT = data.WTS_ENVIRONMENT;
} else {
    console.log("读取配置失败")
}
class Method implements ToolsInterface {
    showLoading(title){
        my.showLoading({
            content: title||'loading',
        });
    }
    hideLoading(){
        my.hideLoading();
    }
    //获取授权信息
    auth() {
        return new Promise((resolve, reject) => {
            this.getAppUserinfoByCode().then(data => {
                resolve(data);
            }).catch(e => { //仅通过code获取数据失败
                //通过加密信息获取用户信息
                this.getAppUserinfoByIv().then(data => {
                    resolve(data);
                }).catch(e => { //未绑定微信用户
                    reject(e);
                });
            });
        });
    }
    getAppUserinfoByIv() {
        return new Promise((resolve, reject) => {
            this.getUserinfo().then(params => {
                params.serverCode = store.state.serverCode;
                params.scope = "auth_openuser";
                tools.ajaxMinplatAuth(params).then(data => {
                    resolve(data);
                }).catch(e => {
                    reject(e);
                })
            }).catch(e => {
                reject(e);
            });
        });
    }
    getAppUserinfoByCode() {
        return new Promise((resolve, reject) => {
            this.getCode().then(code => {
                const params = {
                    scope: "auth_base",
                    serverCode: store.state.serverCode,
                    authCode: code
                };
                console.log(params);
                tools.ajaxMinplatAuth(params).then(data => {
                    resolve(data);
                }).catch(e => {
                    reject(e);
                })
            }).catch(e => {
                reject(e);
            });
        });
    }
    //获取支付宝code
    getCode() {
        return new Promise((resolve, reject) => {
            my.getAuthCode({
                scopes: 'auth_base',
                success: (data) => {
                    console.log("getAuthCode", data)
                    resolve(data.authCode);
                },
                fail(e) {
                    console.log(e);
                    reject(e);
                }
            });
        });
    }
    //获取支付宝用户信息
    getUserinfo() {
        return new Promise((resolve, reject) => {
            this.getCode().then(code => {
                my.getOpenUserInfo({
                    success: (data) => {
                        let userInfo = JSON.parse(data.response).response
                        if (userInfo.code == "10000") {
                            userInfo.authCode = code;
                            resolve(userInfo);
                        } else {
                            console.log("获取授权失败", data);
                            reject();
                        }
                    },
                    fail(e) {
                        reject(e);
                    }
                });
            }).catch(e => {
                reject(e);
            });
        });
    }
    register() {
        return new Promise((resolve, reject) => {
            this.getCode().then(code => {
                my.getPhoneNumber({
                    success: (data) => {
                        console.log("getPhoneNumber", data);
                        const params = {
                            serverCode: store.state.serverCode,
                            authCode: code,
                            phone: JSON.parse(data.response).response
                        };
                        tools.registerAjax(params, 'login.aliminiRegister').then(data => {
                            resolve(data)
                        }).catch(e => {
                            reject("用户绑定失败");
                        });
                    },
                    fail(e) {
                        reject(e);
                    }
                });
            }).catch(e => {
                reject(e);
            });

        });
    }
    versionFn() {
        const updateManager = my.getUpdateManager();
        console.log("updateManager", updateManager);
        updateManager.onCheckForUpdate((res) => {
            // 请求完新版本信息的回调
            console.log("res.hasUpdate", res.hasUpdate);
            if (res.hasUpdate) {
                my.showLoading({
                    content: '正在更新小程序',
                });
            }
        });
        updateManager.onUpdateReady(() => {
            my.hideLoading();
        });
        updateManager.onUpdateFailed(() => {
            // 新的版本下载失败
            notice.alert('新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~');
        });
    }
    showShare() {

    }
}
export default Method;