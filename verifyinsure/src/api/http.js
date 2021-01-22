import cml from 'chameleon-api';
import httpList from './httpList';
import notice from './notice';
import store from '../store';

const wxRequest = async(params) => {
    return new Promise((resolve, reject) => {
        cml.getStorage('WTS_TOKEN').then((value) => {
            // 处理获取到的键值
            params.token = value || '';
            request(params, function(res, isErr) {
                if (isErr) {
                    console.log("isErr", res);
                    reject(res);
                } else {
                    resolve(res)
                }
            }, function(err) {
                if (reject) reject(err)
            })
        }, function(err) {
            request(params, function(res) {
                resolve(res)
            }, function(err) {
                if (reject) reject(err)
            })
        })

    });
};

function request(params, success, error) {
    console.log(params.url || httpList[params.name].url)
    console.log('params',params.data);
    let session ='';
    cml.getStorage('session').then((ses)=>{
        console.log('ses',ses);
        session = ses;
        console.log('session',session);
        const header = {
            WTS_VERSION: store.state.WTS_VERSION,
            WTS_ENVIRONMENT: store.state.WTS_ENVIRONMENT,
            WTS_TOKEN_A: params.token||'',
            session:session
        }
        cml.request({
            url: params.url || httpList[params.name].url,
            method: params.method || (httpList[params.name] && httpList[params.name].type) || "POST",
            contentType: params.contentType || 'json',
            data: params.data || {},
            header: header,
        }).then(res => {
            var isErr = successError(res, params.hideAlert);
            success(res, isErr)
        }, err => {
            if (error) error(err)
        });
    })
}
//公共错误处理
function successError(data, hideAlert) {
    //服务器出错
    if (data.httpCode != 1 && data.data && data.data.errorMsg) {
        !hideAlert && notice.alert(data.data.errorMsg)
        return true;
    } else if (data.httpCode != 1) {
        // !hideAlert && notice.alert(data.msg)
        return true;
    }
    return false;
}

module.exports = wxRequest



// http({
//   name:'product.list',
//   data: {
//     pageType: "1"
//   },
//   method:'get',//默认get
//   contentType:'json',//默认json , json/form
// }).then(function(r,e){


// })