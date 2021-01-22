import store from '../store';
import http from './http';
import common from './common';
import cml from 'chameleon-api';
store.state.shareImg = common.shareImg;
store.state.shareText = common.shareText;

// 工具
var tools = {
    //判断是数组
    isArray(o) {
        return Object.prototype.toString.call(o) == '[object Array]';
    },

    //判断null
    isNull: function(exp) {
        if (!exp && typeof exp != 'undefined' && exp != 0) {
            return true;
        } else if (exp == 'null') {
            return true;
        }
        return false;
    },

    /*
     * 深复制
     * params
     * -destination  被赋值的新对象
     * -source  取值的对象
     * -miss  忽略的对象
     * */
    deepCopy: function(data) {
        return JSON.parse(JSON.stringify(data));
    },

    pageHeight() {
        let num;
        cml.getSystemInfo().then((info) => {
            num = Number(info.viewportHeight);
            return num;
        })
    },

    trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },

    ajaxMinplatAuth(params) {
        return new Promise(function(resolve, reject) {
            http({
                name: 'login.minplatAuth',
                data: params,
                hideAlert: true
            }).then(res => {
                console.log("res", res)
                if (res.httpCode != 200) {
                    reject(res);
                    return;
                }
                if (res.token) {
                    res.data.token = res.token;
                    cml.setStorage('WTS_TOKEN', res.token);
                }
                cml.setStorage('WTS_USER_XCX', res.data);
                resolve(res.data);
            }).catch(e => { //未绑定微信用户
                reject(e);
            })
        });
    },
    
    getAppUserinfo() {
        return new Promise(function(resolve, reject) {
            cml.getStorage('WTS_USER_XCX').then((data) => {
                resolve(data);
            })
        });
    },
    registerAjax(params,urlName) {
        console.log("register",params)
        return new Promise(function(resolve, reject) {
            http({
                name: urlName||'login.minplatRegister',
                data: params
            }).then(res => {
                if (res.httpCode != 200) {
                    reject(res);
                    return;
                }
                if (res.token) {
                    res.data.token = res.token;
                    cml.setStorage('WTS_TOKEN', res.token);
                }
                cml.setStorage('WTS_USER_XCX', res.data);
                resolve();
            }).catch(e => {
                reject(e);
            })
        });
    },
    // 设置平台数据
    setEnvData(){
        return new Promise(function(resolve, reject) {
            cml.getSystemInfo().then((info) => {
                store.state.env = info.env;
                const data = common[info.env];
                if(data) {
                    store.state.serverCode = data.serverCode;
                    store.state.WTS_VERSION = data.WTS_VERSION;
                    store.state.WTS_ENVIRONMENT = data.WTS_ENVIRONMENT;
                } else {
                    reject("配置读取失败");
                    return;
                }
                resolve();
            }).catch(e=>{
                reject(e);
            });
        })
    },
    onShareAppMessage(){
        console.log("shareChannel",store.state.channel)
        console.log(imageSrc);
        return {
            title: '保障方案一对一定制，让您省去50%保费获得更多保障！',
            imageUrl: imageSrc,
            bgImgUrl: imageSrc,
            path: '/pages/index?c=' + store.state.channel
            // path: 'pages/index?c=test'
        }
    }
};

export default tools