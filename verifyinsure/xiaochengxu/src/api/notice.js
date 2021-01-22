import cml from 'chameleon-api';

/**
 * 提示与加载工具类
 */
export default class Notice {
  constructor () {}
  /**
         * 弹出提示框
         */

  static msg (title, duration = 2000) {
    cml.showToast ({
      message: title,
      duration: duration,
    });
  }
  static alert (message,title="我知道了") {
    cml.alert({
      message:message,
      confirmTitle:title
    }).then(function(value){

    })
  }
  static confirm(message, btn=['确认','取消']) {
    return new Promise((resolve, reject) => {
      cml.confirm({
            message:message,
            confirmTitle:btn[0],
            cancelTitle: btn[1]
        }).then(function(value){
          if(value==btn[0]){
            resolve(value)
          }else{
            reject(value)
          }
      })
    })
  }
}


// 使用
// notice.confirm('是否确认？').then(function(v){
//   notice.msg(v)
// }).catch(function(e){
//   notice.msg(e)
// })
