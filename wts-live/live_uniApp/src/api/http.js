
import httpList from './httpList';
import notice from './notice';
import store from '../store/state';
function uniRequest(params) {
  return new Promise ((resolve, reject) => {
	params.token = store.token || "";
	//渠道
	params.channel = store.channel || "";
	//版本
	params.version = store.version || "";
	request(params,function(res){
		resolve(res)
	  },function(err){ 
		if(reject)reject(err)
	  })
  });
}

function request(params,success,error){
	// 未获取到httpList的url,就取params的url
	var url= httpList[params.name].url?httpList[params.name].url:params.url;
	//请求域名
	var reqUrl = store.domain[store.env];
  uni.request({
    url:reqUrl+url,
    method: httpList[params.name].type || 'POST',
    data: params.data || {},
    header: { 
		'token': params.token,
		"WTS_ENVIRONMENT":params.channel,
		"WTS_VERSION":params.version,
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