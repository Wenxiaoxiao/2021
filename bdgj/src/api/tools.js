import notice from './notice';
import cml from 'chameleon-api';
import http from './http';
import store from '../store';
import util from '../components/util/util.interface'

// 工具
var tools = {
  //判断是数组
  isArray (o) {
    return Object.prototype.toString.call (o) == '[object Array]';
  },

  //判断null
  isNull: function (exp) {
    if (!exp && typeof exp != 'undefined' && exp != 0) {
      return true;
    } else if (exp == 'null') {
      return true;
    }
    return false;
  },
  // 是否手机号
  isPhone: function (phone) {
    var pattern = /^1[3,4,5,7,8]\d{9}$/;
    return pattern.test (phone);
  },
  // 是否身份证
  isIdCard: function(id) {
    var pattern= /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    return pattern.test(id);
  },
  // 去除首尾空白
  trim: function(str) {
    var reg= /^\s+|\s+$/g;
    str = str.replace(reg,"");
    return str;
  },
  share: function (title, path, url) {
    store.state.share.title = title;
    store.state.share.path = path;
    store.state.share.imageUrl = url || '';
  },

  /*
     * 深复制
     * params
     * -destination  被赋值的新对象
     * -source  取值的对象
     * -miss  忽略的对象
     * */
  deepCopy: function (data) {
    return JSON.parse (JSON.stringify (data));
  },

  pageHeight () {
    let num;
    cml.getSystemInfo ().then (info => {
      num = Number (info.viewportHeight);
      return num;
    });
  },

  /**
   * 拨打电话
   *  */
  makingCall (tel) {
    return util.makingCall(tel);
    // return new Promise ((resolve, reject) => {
    //   cml.getSystemInfo ().then (info => {
    //     if (info.env == 'wx') {
    //       if (store.state.KFPhoneNumber) {
    //         wx.makePhoneCall ({
    //           phoneNumber: store.state.KFPhoneNumber,
    //           success (res) {
    //             return resolve (res);
    //           },
    //         });
    //       } else {
    //         http ({
    //           name: 'app_customerService',
    //           data: {code: 'customerService'},
    //         })
    //           .then (data => {
    //             if (!data) return;
    //             store.state.KFPhoneNumber = data.data[0].phoneNumber;
    //             wx.makePhoneCall ({
    //               phoneNumber: store.state.KFPhoneNumber,
    //               success (res) {
    //                 return resolve (res);
    //               },
    //             });
    //           })
    //           .catch (error => {
    //             console.log (error);
    //           });
    //       }
    //     }
    //   });
    // });
  },

  // 下载文件
  downloadFile (url) {
    return util.downloadFile(url);
    // return new Promise ((resolve, reject) => {
    //   cml.getSystemInfo ().then (info => {
    //     if (info.env == 'wx') {
    //       wx.downloadFile ({
    //         url: url, //仅为示例，并非真实的资源
    //         success (res) {
    //           return resolve (res.tempFilePath);
    //         },
    //       });
    //     }
    //   });
    // });
  },

  //打开文件
  openDocument (filePath) {
    return util.openDocument(filePath);
    // return new Promise ((resolve, reject) => {
    //   cml.getSystemInfo ().then (info => {
    //     if (info.env == 'wx') {
    //       wx.openDocument ({
    //         filePath: filePath,
    //         fileType: 'pdf',
    //         success: function (res) {
    //           console.log ('打开文档成功');
    //           console.log (res);
    //           return resolve (res);
    //         },
    //         fail: function (res) {
    //           console.log ('fail');
    //           console.log (res);
    //           notice.hideloading();
    //           return reject (res);
    //         },
    //         complete: function (res) {
    //           console.log ('complete');
    //           console.log (res);
    //         },
    //       });
    //     }
    //   });
    // });
  },

  /*
     * 授权登录相关信息
     * */
  login (url, que) {
    this.getOsInfo();
    return util.login(url, que);
    // var query = {path: url || ''};
    // if (que) {
    //   query = Object.assign (query, que);
    // }
    // return new Promise ((resolve, reject) => {
    //   cml.getSystemInfo ().then (info => {
    //     if (info.env == 'wx') {
    //       wx.login ({
    //         success: res => {
    //           var code = res.code;
    //           http ({
    //             name: 'p_WX_userInfo',
    //             intercept:true,
    //             data: {
    //               authCode: code,
    //               serverCode: 'wxmini',
    //             },
    //           })
    //             .then (data => {
    //               if (data.httpCode == 303 || data.httpCode == 402 || data.httpCode == 401)
    //                 return cml.redirectTo ({
    //                   path: '/pages/authorizationPage/authorizationPage',
    //                   query: query,
    //                 });
    //               if (data.httpCode != 200) return notice.alert (data.msg);
    //               if(!data.data || !data.data.unionid) 
    //               return cml.redirectTo ({
    //                 path: '/pages/authorizationPage/authorizationPage',
    //                 query: query,
    //               });
    //               store.state.WTS_USER_XCX = data.data;
    //               store.state.token = data.token;
    //               return resolve (data.data);
    //             })
    //             .catch (error => {
    //               console.log (error);
    //             });
    //         },
    //       });
    //     }
    //   });
    // });
  },

  //判断是否授权
  getSetting () {
    return util.getSetting();
    // return new Promise ((resolve, reject) => {
    //   cml.getSystemInfo ().then (info => {
    //     if (info.env == 'wx') {
    //       wx.getSetting ({
    //         success: res => {
    //           //未授权先授权
    //           if (!res.authSetting['scope.userInfo']) {
    //             return resolve (false);
    //           }
    //           return resolve (true);
    //         },
    //       });
    //     }
    //   });
    // });
  },

  getPlatformUserInfo () {
    return util.getPlatformUserInfo();
    // return new Promise ((resolve, reject) => {
    //   cml.getSystemInfo ().then (info => {
    //     if (info.env == 'wx') {
    //       //已授权直接获取用户信息
    //       wx.login ({
    //         success: res => {
    //           var code = res.code;
    //           // 直接用code获取用户信息
    //           wx.getUserInfo ({
    //             withCredentials: true,
    //             success: userInfo => {
    //               //通过对应信息获取用户信息
    //               http ({
    //                 name: 'p_WX_userInfo',
    //                 data: {
    //                   iv: userInfo.iv,
    //                   encryptedData: userInfo.encryptedData,
    //                   authCode: code,
    //                   serverCode: 'wxmini',
    //                 },
    //               })
    //                 .then (data => {
    //                   if (!data) return;
    //                   store.state.WTS_USER_XCX = data.data;
    //                   store.state.token = data.token;
    //                   return resolve (data.data);
    //                 })
    //                 .catch (error => {
    //                   console.log (error);
    //                 });
    //             },
    //           });
    //         },
    //       });
    //     }
    //   });
    // });
  },


  //隐藏分享
  hideMenu(){
    util.hideMenu();
    //  cml.getSystemInfo ().then (info => {
    //     if (info.env == 'wx') {
    //       wx.hideShareMenu();
    //     }
    //  })
  },

  getOsInfo(){
    var osInfo = util.getOsInfo();
    store.state.version = osInfo.version;
    store.state.channel = osInfo.os;
  },
  // 防抖
  debounce(fn, wait) {
    var timer;
    return function() {
      clearTimeout(timer);
      var context = this;
      var args = arguments;
      timer = setTimeout(function() {
        fn.call(context,args);
      }, wait);
    };
  }
};

export default tools;
