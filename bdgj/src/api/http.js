import cml from 'chameleon-api';
import httpList from './httpList';
import notice from './notice';
import store from '../store';

const wxRequest = async (params) => {
  
  return new Promise ((resolve, reject) => {
    // cml.getStorage('WTS_TOKEN').then((value)=>{
    //   // 处理获取到的键值
    //   params.token=value ||'';
    //   request(params,function(res){
    //     resolve(res)
    //   },function(err){
    //     if(reject)reject(err)
    //   })
    // },function(err){
    //   request(params,function(res){
    //     resolve(res)
    //   },function(err){
    //     if(reject)reject(err)
    //   })
    // })
    params.token = store.state.token || "";
    //渠道
    params.channel = store.state.channel || "";
    //版本
    params.version = store.state.version || "";
    request(params,function(res){
        resolve(res)
      },function(err){
        if(reject)reject(err)
      })
    
  });
};

function request(params,success,error){
  cml.request({
    url:httpList[params.name].url || params.url,
    method: httpList[params.name].type || 'POST',
    contentType:params.contentType || 'json',
    data: params.data || {},
    header: { 'WTS_TOKEN_A': params.token,"WTS_ENVIRONMENT":params.channel,"WTS_VERSION":params.version},
  }).then( res => {
    var isErr = true;
    if(!params.intercept){
      var isErr = successError (res);
    } 
    if(success)success(res,isErr)
    }, err => {
    if(error)error(err)
  });
}
//公共错误处理
function successError (data) {
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

module.exports = wxRequest;



// http({
//   name:'product.list',
//   data: {
//     pageType: "1"
//   },
//   method:'get',//默认get
//   contentType:'json',//默认json , json/form
// }).then(function(r,e){
  
  
// })
