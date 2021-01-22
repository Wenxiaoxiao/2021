
import httpList from './httpList';
import notice from './notice';
import store from '../store.js';

var devUrl= 'https://test-zb.lzyunying.com'; //测试地址
var prodUrl= 'https://zb.wts999.com'; //正式地址
var testUrl= 'https://test-zb.lzyunying.com' // 调试域名

function uniRequest(params) {
  return new Promise ((resolve, reject) => {
	params.token = store.token? store.token : "";
	//渠道
	params.channel = store.channel? store.channel : "";
	//版本
	params.version = store.version? store.version : "";
	request(params,function(res){
		resolve(res)
	  },function(err){ 
		if(reject)reject(err)
	  })
  });
}

function request(params,success,error){
    var loginInfo = uni.getStorageSync("loginInfo");
	// 未获取到httpList的url,就取params的url
	var url= httpList[params.name].url?httpList[params.name].url:params.url;
  uni.request({
    url:devUrl+url,
    method: httpList[params.name].type || 'POST',
    data: params.data || {},
    header: { 
		// 'WTS_TOKEN_A': params.token,
		// "WTS_ENVIRONMENT":params.channel,
		// "WTS_VERSION":params.version,
		"token":loginInfo.data?loginInfo.data.token:'',
		'content-type': params.header || 'application/json',
	},
	success: res => {
			var isErr = true;
			if(!params.intercept){
			  var isErr = successError (res.data);
			} 
			if(success)success(res.data,isErr)
		}, 
	fail: err => {
			if(error)error(err)
		}
	})
}
//公共错误处理
function successError(data) {
  //服务器出错
  if (data.httpCode != 200 && data.data && data.data.errorMsg) {
      notice.alert(data.data.errorMsg)
      return false;
  }else if(data.httpCode != 200){
      notice.alert(data.msg)
      return false;
  }
  return true;
}

module.exports = {uniRequest}



// http({
//   name:'product.list',
//   data: {
//     pageType: "1"
//   },
//   method:'get',//默认get
//   contentType:'json',//默认json , json/form
// }).then(function(r,e){
  
  
// })
