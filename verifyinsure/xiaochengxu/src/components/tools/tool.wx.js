import tools from '../../api/tools.js';
import common from '../../api/common.js';
import store from '../../store';

const data = common["wx"];
if (data) {
    store.state.serverCode = data.serverCode;
    store.state.WTS_VERSION = data.WTS_VERSION;
    store.state.WTS_ENVIRONMENT = data.WTS_ENVIRONMENT;
} else {
    console.log("读取配置失败")
}
class Method implements ToolsInterface {
    showLoading(title) {
        wx.showLoading({
            title: title || 'loading',
        });
    }
    hideLoading() {
        wx.hideLoading();
    }
    //获取授权信息
    auth() {
        return new Promise((resolve, reject) => {
            this.getAppUserinfoByCode().then(data => {
                resolve(data);
            }).catch(e => { //仅通过code获取数据失败
                //通过微信加密信息获取用户信息
                this.getAppUserinfoByIv().then(data => {
                    resolve(data);
                }).catch(e => { //未绑定微信用户
                    reject(e);
                });
            });
        });
    }
    getAppUserinfoByCode() {
        return new Promise((resolve, reject) => {
            this.getWxCode().then(code => {
                const params = {
                    serverCode: store.state.serverCode,
                    authCode: code
                }
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
    getAppUserinfoByIv() {
        return new Promise((resolve, reject) => {
            this.getWxUserinfo().then(data => {
                const params = {
                    serverCode: store.state.serverCode,
                    authCode: data.code,
                    iv: data.iv,
                    encryptedData: data.encryptedData,
                };
                tools.ajaxMinplatAuth(params).then(data => {
                    resolve(data);
                }).catch(e => {
                    reject(e);
                })
            }).catch(e => {
                console.log(e);
                reject({ needAuth: true });
            });
        });
    }
    register(params) {
        return new Promise((resolve, reject) => {
            this.getWxCode().then(code => {
                params.authCode = code;
                tools.registerAjax(params).then(data => {
                    resolve(data)
                }).catch(e => {
                    reject("用户绑定失败");
                });
            }).catch(e => {
                reject(e);
            });
        });
    }
    //获取微信code
    getWxCode() {
        return new Promise(function (resolve, reject) {
            wx.login({
                success(res) {
                    console.log('WX_Login', res)
                    if (res.code) {
                        resolve(res.code);
                    } else {
                        reject("获取code失败");
                    }
                },
                fail(e) {
                    reject(e);
                }
            })
        });
    }
    //获取微信用户信息
    getWxUserinfo() {
        return new Promise((resolve, reject) => {
            this.getWxCode().then(code => {
                //需要先调用微信login
                wx.getUserInfo({
                    withCredentials: true,
                    success: function (res) {
                        res.code = code;
                        resolve(res);
                        console.log('wx_userinfo', res);
                    },
                    fail(e) {
                        reject(e);
                    }
                })
            }).catch(e => {
                reject();
            })
        });
    }
    versionFn() {
        const updateManager = wx.getUpdateManager();
        console.log("updateManager", updateManager);
        updateManager.onCheckForUpdate((res) => {
            // 请求完新版本信息的回调
            console.log(res.hasUpdate);
            if (res.hasUpdate) {
                wx.showLoading({
                    title: '正在更新小程序',
                });
            }
        });
        updateManager.onUpdateReady(() => {
            wx.hideLoading();
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
        });
        updateManager.onUpdateFailed(() => {
            // 新的版本下载失败
            notice.alert('新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~');
        });
    }
    showShare() {
        wx.showShareMenu({
            withShareTicket: true
        });
    }
}

export default Method;