
import httpList from './httpList';
import notice from './notice';
import store from '../store/state';

var devUrl= 'https://bx.wts9999.net'; //测试地址
var prodUrl= 'https://bx.wts999.com'; //正式地址
var testUrl= 'http://bx-dev.lazhuyun.cn' // 调试域名

function uniRequest(params) {
  return new Promise ((resolve, reject) => {
	params.token = store.token || "";
	//渠道
	params.channel = store.channel || "";
	//版本
	params.version = store.version || "";
	request(params,function(res,isErr){
		//resolve(res)
		//resolve(res)
		if(!isErr){
			resolve(res)
		}else{
			 reject(res)
		}
		notice.hideloading()
	  },function(err){ 
		if(reject)reject(err)
	  })
  });
}

function request(params,success,error){
	// 未获取到httpList的url,就取params的url
	var url= httpList[params.name].url?httpList[params.name].url:params.url;
  uni.request({
    url:prodUrl+url,
    method: httpList[params.name].type || 'POST',
    data: params.data || {},
    header: { 
		'WTS_TOKEN_A': params.token,
		"WTS_ENVIRONMENT":params.channel,
		"WTS_VERSION":params.version,
		'content-type': params.header || 'application/json',
	},
	success: res => {
			var isErr = false;
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
  if ((data.httpCode != 200 ||data.httpCode != 1)&& data.data && data.data.errorMsg) {
      notice.alert(data.data.errorMsg)
      return true;
  }else if(data.httpCode != 200&&data.httpCode != 1){
      notice.alert(data.msg)
      return true;
  }
  return false;
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
