import http from './http.js'

var utils= {
	//获取微信code
	getWxCode(loginCb) {
		var self= this;
		return new Promise(function (resolve, reject) {
			uni.login({
				success(res) {
					http.uniRequest({
						name: 'login',
						data: {
							code: res.code
						}
					})
					.then(function(res) {
						uni.setStorageSync("loginInfo",res)
						if(loginCb){
							loginCb()
						}
						resolve(res.code)
					})
				},
				fail(e) {
					reject(e);
				}
			})
		});
	}
}

export default utils;