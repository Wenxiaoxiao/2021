import cml from 'chameleon-api';
import util from '../components/util/util.interface';

/**
 * 提示与加载工具类
 */
export default class Notice {
  constructor () {}
  /**
         * 弹出提示框
         */

  static msg (title, duration) {
    cml.showToast ({
      message: title,
      duration: duration || 1000,
    });
  }
  static alert (message,title="我知道了",cb) {
    cml.alert({
      message:message,
      confirmTitle:title
    }).then(function(value){
      typeof cb == 'function' && cb();
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

  //显示加载中
  static showloading(title) {
    // cml.getSystemInfo().then((info) => {
    //   if(info.env == 'wx') {
    //     wx.showLoading({
    //       title: title,
    //     })
    //   }
    // })
    util.showLoading({
      title: title
    });
  }

  //隐藏加载中
  static hideloading() {
    util.hideLoading();
    // cml.getSystemInfo().then((info) => {
    //   if(info.env == 'wx') {
    //     wx.hideLoading()
    //   }
    // })
  }
};


// 使用
// notice.confirm('是否确认？').then(function(v){
//   notice.msg(v)
// }).catch(function(e){
//   notice.msg(e)
// })
