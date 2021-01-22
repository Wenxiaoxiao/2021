
import http from './http.js';
import wxApi from './interface/wxApi';
import zfbApi from './interface/zfbApi';

const utils = {
    // #ifdef MP-WEIXIN
    getSetting:wxApi.getSetting,
    getuserInfoByCode:wxApi.getuserInfoByCode,
    getPlatformUserInfo:wxApi.getPlatformUserInfo,
    // #endif
    // #ifdef MP-ALIPAY
    getSetting:zfbApi.getSetting,
    getuserInfoByCode:zfbApi.getuserInfoByCode,
    getPlatformUserInfo:zfbApi.getPlatformUserInfo
    // #endif
}

module.exports = utils;
