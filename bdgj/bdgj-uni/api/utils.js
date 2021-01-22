
import http from './http.js';
import store from '../store/state';

const utils = {
	// #ifdef MP-WEIXIN
  /**
      * 拨打电话
      *  
      * */
	makingCall (tel) {
		return new Promise ((resolve, reject) => {
		    if (tel) {
				uni.makePhoneCall ({
				  phoneNumber: tel,
				  success (res) {
					return resolve (res);
				  },
				});
		    } else {
				http.uniRequest({
				  name: 'app_customerService',
				  data: {code: 'customerService'},
				})
				  .then (data => {
					if (!data) return;
					store.KFPhoneNumber = data.data[0].phoneNumber;
					uni.makePhoneCall ({
					  phoneNumber: store.KFPhoneNumber,
					  success (res) {
						return resolve (res);
					  },
					});
				  })
				  .catch (error => {
					console.log (error);
				  });
		    }
		});
	},
  // 下载文件
  downloadFile (url) {
    return new Promise ((resolve, reject) => {
	  uni.downloadFile ({
		url: url, //仅为示例，并非真实的资源
		success (res) {
		  return resolve (res.tempFilePath);
		}
	  });
	})
  },

  //打开文件
  openDocument (filePath) {
    return new Promise ((resolve, reject) => {
          uni.openDocument ({
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
              uni.hideloading ();
              return reject (res);
            },
            complete: function (res) {
              console.log ('complete');
              console.log (res);
            },
          });
        }
	);
  },

  /*
     * 授权登录相关信息
     * 
     * */
  login (url, que) {
    return new Promise ((resolve, reject) => {
        uni.login ({
            success: res => {
                var code = res.code;
                http.uniRequest({
					name: 'p_WX_userInfo',
					intercept: true,
					data: {
					  authCode: code,
					  serverCode: 'wxmini',
					},
                })
                .then (data => {
                  var gotoSetting = false;
                  if ( data.httpCode == 303 || data.httpCode == 402 || data.httpCode == 401 )
                   {
					   // 未登录成功
					   gotoSetting = true;
				   }
				
                  if (!data.data || !data.data.unionid) gotoSetting = true;

                  //判断是否有授权
                  if (gotoSetting) {
                    return this.getSetting ().then (flag => {
                      if (!flag) {
						store.login = false;
						resolve({});
                        return;
                      }
                      this.getPlatformUserInfo ().then(res =>{
                        resolve(res);
                      }).catch(e =>{
						store.login = false;
						reject(e);
						return;
                      });
                    });
                  }
                  store.WTS_USER_XCX = data.data;
                  store.token = data.token;
				  store.login = true;
                  resolve (data.data);
                })
                .catch (error => {
                  console.log (error);
                });
            },
            fail: res => {
              console.log(res);
            }
          });
        }
	);
  },

  //判断是否授权
  getSetting () {
    return new Promise ((resolve, reject) => {
          uni.getSetting ({
            success: res => {
              //未授权先授权
			  console.log("setting:",res);
              if (!res.authSetting['scope.userInfo']) {
                return resolve (false);
              }
              return resolve (true);
            },
          });
        }
	);
  },

  getPlatformUserInfo () {
    return new Promise ((resolve, reject) => {
      uni.login ({
        success: res => {
          var code = res.code;
          // 直接用code获取用户信息
          uni.getUserInfo ({
            withCredentials: true,
            success: userInfo => {
              store.userInfo = userInfo;
              //通过对应信息获取用户信息
              http.uniRequest({
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
                  store.WTS_USER_XCX = data.data;
                  store.token = data.token;
				  store.login = true;
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
  },

  showLoading (option) {
    let {
      title = '加载中...',
      mask = false,
      success = function () {},
      fail = function () {},
    } = option;
    uni.showLoading ({
      title,
	  // #ifndef MP-ALIPAY
      mask,
	  // #endif
      success,
      fail,
    });
  },

  hideLoading (option = {}) {
    let {success = null, fail = null} = option;
    uni.hideLoading ({
      success,
      fail,
    });
  },

  getUpdateManager () {
    return uni.getUpdateManager ();
  },

  hideMenu () {
     return   uni.hideShareMenu ();
  },

  hideShareMenu () {
    
  },

  getOsInfo () {
    return {
      os: 'xcx_wx',
      version: '1.2.7',
    };
  },

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
    uni.showModal({
      title,
      content,
      success
    })
  },

  showToast(option = {}){
    let {
      title = "成功",
      duration = 1500,
      icon = 'none'
    } = option;
    uni.showToast({
      title,
      duration,
      icon
    });
  }
	// #endif
	// 支付宝小程序
	// #ifdef MP-ALIPAY
	makingCall(tel) {
	    if (tel) {
	        my.makePhoneCall ({
	            number: tel
	        });
	    } else {
	        http.uniRequest({
	            name: 'app_customerService',
	            data: {code: 'customerService'},
	        })
	        .then (data => {
	            if (!data) return;
	            store.KFPhoneNumber = data.data[0].phoneNumber;
	            my.makePhoneCall ({
	                number: store.KFPhoneNumber
	            });
	        })
	        .catch (error => {
	            console.log (error);
	        });
	    }
	},
	
	// 下载文件
	downloadFile (url) {
			console.log("xpdf1:",url)
	  return new Promise ((resolve, reject) => {
		  uni.downloadFile ({
			url: url, //仅为示例，并非真实的资源
			success (res) {
			console.log("xpdf2:",res.tempFilePath);
			  // return resolve (res.apFilePath);
			  return resolve (res.tempFilePath);
			},
			complete(res) {
				console.log("xpdf3:",res);
			}
		  });
		})
	},
	
	//打开文件
	openDocument (filePath) {
	  return new Promise ((resolve, reject) => {
	        my.openDocument({
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
	            uni.hideloading ();
	            return reject (res);
	          },
	          complete: function (res) {
	            console.log ('complete');
	            console.log (res);
	          },
	        });
	      }
		);
	},
	
	login(url, que) {
	    return new Promise ((resolve, reject) => {
	        let scopes = 'auth_base'; 
	        // let scopes = 'auth_user';
	        my.getAuthCode({
	            scopes: scopes,
	            success: (res) => {
	                let code = res.authCode;
					console.log("authcode:",res);
	                http.uniRequest({
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
							store.login = false;
							resolve();
							return ;
							// if(url) {
							// 	return uni.redirectTo ({
							// 		url: '/pages/authorizationPage/authorizationPage?path='+url
							// 	});
							// }else {
							// 	return uni.redirectTo ({
							// 		url: '/pages/authorizationPage/authorizationPage'
							// 	});
							// }
	                        
	                    }
	                    if(!data.data || !data.data.unionid)
	                    {
							store.login = false;
							resolve();
							return ;
							// if(url) {
							// 	return uni.redirectTo ({
							// 		url: '/pages/authorizationPage/authorizationPage?path='+url
							// 	});
							// }else {
							// 	return uni.redirectTo ({
							// 		url: '/pages/authorizationPage/authorizationPage'
							// 	});
							// }
	                    }
	                    store.WTS_USER_XCX = data.data;
	                    store.token = data.token;
						store.login = true;
	                    resolve (data.data);
	                })
					.catch(data => {
						console.log("loginErr:",data);
					})
	            }
	        });
	    });
	},
	
	getSetting() {
	    return new Promise ((resolve, reject) => {
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
	    });
	},
	
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
	                        http.uniRequest({
	                            name: 'p_ALIPAY_authcode',
	                            data: Object.assign({}, userInfo, {
	                                authCode: code,
	                                serverCode: 'alpmini',
	                                scope:'auth_openuser'
	                            })
	                        })
	                        .then (data => {
	                            if (!data) return;
	                            store.WTS_USER_XCX = data.data;
	                            store.token = data.token;
								store.login = true;
	                            resolve (data.data);
	                        })
	                        .catch (error => {
	                            console.log (error);
	                        });
	                    }
	                });
	            },
	        });
	    });
	},
	
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
	},
	
	canIUse(str){
	    return my.canIUse(str);
	},
	
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
	},
	
	hideLoading() {
	    my.hideLoading({
	        success: function(){
	
	        }
	    });
	},
	
	getUpdateManager(){
	    return my.getUpdateManager();
	},
	
	hideMenu(){
	    
	},
	
	getOsInfo(){
	    return  {
	      os:"xcx_alipay",
	      version:"1.2.7"
	    }
	},
	
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
	},
	
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
	},
	
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
	// #endif
}

module.exports = utils;
