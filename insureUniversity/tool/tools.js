import http from './http.js'
import store from '../store.js'
var tools = {
	subString: function(value, length) {
	    if (!value) {
	      return "";
	    }
	    value = value.trim();
	    if (value.length > length) {
	      var first = value.toString().substring(0, length);
	      value = first + "...";
	    }
	    return value;
	},
	queryString: function(str,name) {
	    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
	    var r = str.match(reg);
	    if (r != null) {
	        return decodeURIComponent(r[2]);
	    }
	    return null;
	},
	// 时间处理
	trustTime: function(inHisTime, pattern) {
	    if (!inHisTime) {
	      return;
	    }
	    inHisTime = inHisTime.toString().trim().replace(/-/gm, "/");
	    var date = null,
	      now = new Date();
	    if (inHisTime.indexOf("/") != -1) { //yyyy-mm-dd HH:mm:ss
	      date = new Date(inHisTime);
	    } else {
	      date = new Date(Number(inHisTime)); // long 整型
	    }
	    var year = date.getFullYear(),
	      month = date.getMonth() + 1,
	      day = date.getDate(),
	      hours = date.getHours(),
	      minute = date.getMinutes();
	    var minuteTime = (hours < 10 ? "0" + hours : hours) + ":" + (minute < 10 ? "0" + minute : minute),
	      monthTime = (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
	    if (pattern && pattern.toLowerCase() === "time") {
	      return minuteTime;
	    } else if (now.toLocaleDateString() === date.toLocaleDateString()) {
	      //当天 只显示时间
	      return minuteTime;
	    } else if (year === now.getFullYear()) {
	      //当年 显示 月-日 时间
	      return monthTime + " " + minuteTime;
	    } else {
	      //不是当年
	      return year + "-" + monthTime + " " + minuteTime;
	    }
	},
	add0(m) {
	    return m < 10 ? '0' + m : m
	},
	isToday(str) {
	    var d = new Date(str);
	    var todaysDate = new Date();
	    if (todaysDate.getTime() - d.getTime() < 86400000) {
	        return d.getHours() + ':' + this.add0(d.getMinutes()) + ':' + this.add0(d.getSeconds());
	    } else {
	        var mouth = d.getMonth() + 1;
	        var day = d.getDate();
	        return mouth + "月" + day;
	    }
	},
	strToJson(str) {
	    return JSON.parse(str);
	},
	// 时间处理
	formatTime: function(time) {
	    if (!time) {
	      return;
	    }
	    var date = time.toString().trim().replace(/-/gm, "/");new Date(Number(time));
		date = new Date(date);
	    var year = date.getFullYear(),
	      month = date.getMonth() + 1,
	      day = date.getDate(),
	      hours = date.getHours(),
	      minute = date.getMinutes();
	    var minuteTime = (hours < 10 ? "0" + hours : hours) + ":" + (minute < 10 ? "0" + minute : minute),
	      monthTime = (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
		  
	      return year + "-" + monthTime + " " + minuteTime;
	},
	/*内容\n换成回车*/
	fmtContent: function(value) {
	    if (!value) return;
	    value = value.split("\n").join("<br/>");
	    return value;
	},
	// 是否手机号
	isPhone: function (phone) {
		var pattern = /^1[3,4,5,7,8,9]\d{9}$/;
		return pattern.test (phone);
	},
	// 去除首尾空白
	trim: function(str) {
		var reg= /^\s+|\s+$/g;
		str = str.replace(reg,"");
		return str;
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
	},
	// 登录
	login(cb) {
		// #ifdef MP-WEIXIN
		this.getWxCode(cb);
		// #endif
		// #ifdef MP-TOUTIAO
		this.getTtCode(cb);
		// #endif
	},
	// 获取头条code
	getTtCode(cb) {
		uni.login({
			success(res) {
				http.uniRequest({
					name: 'getTtLoginInfo',
					intercept:true,
					data: {
						code: res.code
					}
				})
				.then(function(res) {
					uni.setStorageSync("loginInfo",res.data);
					store.token = res.data.token;
					// 获取到token后调用后续接口
					if(cb && typeof cb == "function") cb();
					resolve(res.httpCode)
				})
				.catch(function(e) {
				})
			},
			fail(e) {
				reject(e);
			}
		})
	},
	//获取微信code
	getWxCode(cb) {
		var self= this;
		return new Promise(function (resolve, reject) {
			uni.login({
				success(res) {
					http.uniRequest({
						name: 'getLoginInfo',
						intercept:true,
						data: {
							code: res.code
						}
					})
					.then(function(res) {
						uni.setStorageSync("loginInfo",res.data);
						store.token = res.data.token;
						//登录完成调用在线人数统计接口
						if(store.miniPing){
							clearInterval(store.miniPing);
						}
						store.miniPing = setInterval(function(){
							http.uniRequest({
								name: 'miniPing',
								intercept:true,
								data: {
									token: res.data.token
								}
							})
							.then(function(res) {})
						},30000)
						// 获取到token后调用后续接口
						if(cb && typeof cb == "function") cb();
						resolve(res.httpCode)
					})
					.catch(function(e) {
					})
				},
				fail(e) {
					reject(e);
				}
			})
		});
	},
	myShare(url,title) {
	  	return {
	  		title: title, 
	  		path: path,
	  		imageUrl: require('@/assets/images/index/share.jpg')
	  	}
	},
	//检查更新
	getRecentVersion(){
		const updateManager = uni.getUpdateManager();

		console.log("updateManager",updateManager);
		updateManager.onCheckForUpdate(function (res) {
		  // 请求完新版本信息的回调
		  console.log(res);
		  console.log("请求完新版本信息的回调",res.hasUpdate);
		});
		
		updateManager.onUpdateReady(function (res) {
		  uni.showModal({
		    title: '更新提示',
		    content: '新版本已经准备好，是否重启应用？',
		    success(res) {
		      if (res.confirm) {
		        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
		        updateManager.applyUpdate();
		      }
		    }
		  });
		
		});
		
		updateManager.onUpdateFailed(function (res) {
			console.log("新的版本下载失败");
		  // 新的版本下载失败
		  uni.showModal({
			title: '已经有新版本了哟~',
			content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
		  })
		});
	}
}

export default tools;