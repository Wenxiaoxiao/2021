
/**
 * 提示与加载工具类
 */
const notice = {
  msg (title, duration, showIcon) {
    uni.showToast ({
      title: title,
      duration: duration || 1000,
	  icon: 'none'
    });
  },
  alert (message,title="我知道了",cb) {
    uni.showModal({
      content:message,
      confirmText:title,
	  showCancel: false,
	  success: function(res) {
		  if(res.confirm) {
			typeof cb == 'function' && cb();
		  }
	  }
    })
  },
  confirm(message, btn=['确认','取消']) {
    return new Promise((resolve, reject) => {
      uni.showModal({
            content:message,
            confirmText:btn[0],
            cancelText: btn[1]
        }).then(function(value){
          if(value==btn[0]){
            resolve(value)
          }else{
            reject(value)
          }
      })
    })
  },

  //显示加载中
  showloading(title) {
    uni.showLoading({
      title: title
    });
  },

  //隐藏加载中
  hideloading() {
    uni.hideLoading();
  }
};

export default notice;