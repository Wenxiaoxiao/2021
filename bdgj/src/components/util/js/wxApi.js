import cml from 'chameleon-api';
import http from '../../../api/http';
import store from '../../../store';

class Method implements UtilInterface {
  /**
      * 拨打电话
      *  
      * */
  makingCall (tel) {
    return new Promise ((resolve, reject) => {
      cml.getSystemInfo ().then (info => {
        if (info.env == 'wx') {
          if (tel) {
            wx.makePhoneCall ({
              phoneNumber: tel,
              success (res) {
                return resolve (res);
              },
            });
          } else {
            http ({
              name: 'app_customerService',
              data: {code: 'customerService'},
            })
              .then (data => {
                if (!data) return;
                store.state.KFPhoneNumber = data.data[0].phoneNumber;
                wx.makePhoneCall ({
                  phoneNumber: store.state.KFPhoneNumber,
                  success (res) {
                    return resolve (res);
                  },
                });
              })
              .catch (error => {
                console.log (error);
              });
          }
        }
      });
    });
  }

  // 下载文件
  downloadFile (url) {
    return new Promise ((resolve, reject) => {
      cml.getSystemInfo ().then (info => {
        if (info.env == 'wx') {
          wx.downloadFile ({
            url: url, //仅为示例，并非真实的资源
            success (res) {
              return resolve (res.tempFilePath);
            },
          });
        }
      });
    });
  }

  //打开文件
  openDocument (filePath) {
    return new Promise ((resolve, reject) => {
      cml.getSystemInfo ().then (info => {
        if (info.env == 'wx') {
          wx.openDocument ({
            filePath: filePath,
            fileType: 'pdf',
            success: function (res) {
              console.log ('打开文档成功');
              console.log (res);
              return resolve (res);
            },
            fail: function (res) {
              console.log ('fail');
              console.log (res);
              wx.hideloading ();
              return reject (res);
            },
            complete: function (res) {
              console.log ('complete');
              console.log (res);
            },
          });
        }
      });
    });
  }

  /*
     * 授权登录相关信息
     * 
     * */
  login (url, que) {
    var query = {path: url || ''};
    if (que) {
      query = Object.assign (query, que);
    }
    return new Promise ((resolve, reject) => {
      cml.getSystemInfo ().then (info => {
        if (info.env == 'wx') {
          wx.login ({
            success: res => {
              var code = res.code;
              http ({
                name: 'p_WX_userInfo',
                intercept: true,
                data: {
                  authCode: code,
                  serverCode: 'wxmini',
                },
              })
                .then (data => {
                  var gotoSetting = false;
                  if (
                    data.httpCode == 303 ||
                    data.httpCode == 402 ||
                    data.httpCode == 401
                  )
                  gotoSetting = true;

                  if (!data.data || !data.data.unionid) gotoSetting = true;

                  //判断是否有授权
                  if (gotoSetting) {
                    return this.getSetting ().then (flag => {
                      if (!flag) {
                        return cml.redirectTo ({
                          path: '/pages/authorizationPage/authorizationPage',
                          query: query,
                        });
                      }
                      this.getPlatformUserInfo ().then(res =>{
                        resolve(res);
                      }).catch(e =>{
                        cml.redirectTo ({
                          path: '/pages/authorizationPage/authorizationPage',
                          query: query,
                        });
                        reject(e);
                      });
                    });
                  }
                  store.state.WTS_USER_XCX = data.data;
                  store.state.token = data.token;
                  return resolve (data.data);
                })
                .catch (error => {
                  console.log (error);
                });
            },
            fail(res){
              console.log(res);
            }
          });
        }
      });
    });
  }

  //判断是否授权
  getSetting () {
    return new Promise ((resolve, reject) => {
      cml.getSystemInfo ().then (info => {
        if (info.env == 'wx') {
          wx.getSetting ({
            success: res => {
              //未授权先授权
              if (!res.authSetting['scope.userInfo']) {
                return resolve (false);
              }
              return resolve (true);
            },
          });
        }
      });
    });
  }

  getPlatformUserInfo () {
    return new Promise ((resolve, reject) => {
      wx.login ({
        success: res => {
          var code = res.code;
          // 直接用code获取用户信息
          wx.getUserInfo ({
            withCredentials: true,
            success: userInfo => {
              store.state.userInfo = userInfo;
              //通过对应信息获取用户信息
              http ({
                name: 'p_WX_userInfo',
                data: {
                  iv: userInfo.iv,
                  encryptedData: userInfo.encryptedData,
                  authCode: code,
                  serverCode: 'wxmini',
                },
              })
                .then (data => {
                  if (!data || !data.data) {
                    return reject();
                  }
                  store.state.WTS_USER_XCX = data.data;
                  store.state.token = data.token;
                  resolve(data.data);
                })
                .catch (error => {
                  reject(error);
                });
            },
          });
        },
      });
    });
  }

  showLoading (option) {
    let {
      title = '加载中...',
      mask = false,
      success = function () {},
      fail = function () {},
    } = option;
    wx.showLoading ({
      title,
      mask,
      success,
      fail,
    });
  }

  hideLoading (option = {}) {
    let {success = null, fail = null} = option;
    wx.hideLoading ({
      success,
      fail,
    });
  }

  getUpdateManager () {
    return wx.getUpdateManager ();
  }

  hideMenu () {
    cml.getSystemInfo ().then (info => {
      if (info.env == 'wx') {
        wx.hideShareMenu ();
      }
    });
  }

  hideShareMenu () {
    
  }

  getOsInfo () {
    return {
      os: 'xcx_wx',
      version: '1.2.7',
    };
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
    wx.showModal({
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
    wx.showToast({
      title,
      duration,
      icon
    });
  }
}

export default Method;
