import notice from './notice';
import http from './http';
import store from '../store/state';
import util from './utils'

// 工具
var tools = {
  //判断是数组
  isArray (o) {
    return Object.prototype.toString.call (o) == '[object Array]';
  },

  //判断null
  isNull: function (exp) {
    if (!exp && typeof exp != 'undefined' && exp != 0) {
      return true;
    } else if (exp == 'null') {
      return true;
    }
    return false;
  },
  // 是否手机号
  isPhone: function (phone) {
    var pattern = /^1[3,4,5,7,8,9]\d{9}$/;
    return pattern.test (phone);
  },
  // 是否身份证
  isIdCard: function(id) {
    var pattern= /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    return pattern.test(id);
  },
  // 去除首尾空白
  trim: function(str) {
    var reg= /^\s+|\s+$/g;
    str = str.replace(reg,"");
    return str;
  },
  share: function (title, path, url) {
    store.share.title = title;
    store.share.path = path;
    store.share.imageUrl = url || '';
  },

  /*
     * 深复制
     * params
     * -destination  被赋值的新对象
     * -source  取值的对象
     * -miss  忽略的对象
     * */
  deepCopy: function (data) {
    return JSON.parse (JSON.stringify (data));
  },

  pageHeight () {
    let num;
    uni.getSystemInfo ().then (info => {
      num = Number (info.windowHeight);
      return num;
    });
  },

  /**
   * 拨打电话
   *  */
  makingCall (tel) {
    return util.makingCall(tel);
  },

  // 下载文件
  downloadFile (url) {
    return util.downloadFile(url);
  },

  //打开文件
  openDocument (filePath) {
    return util.openDocument(filePath);
  },

  /*
     * 授权登录相关信息
     * */
  login (url, que) {
    this.getOsInfo();
    return util.login(url, que);
  },

  //判断是否授权
  getSetting () {
    return util.getSetting();
  },

  getPlatformUserInfo () {
    return util.getPlatformUserInfo();
  },


  //隐藏分享
  hideMenu(){
    util.hideMenu();
  },

  getOsInfo(){
    var osInfo = util.getOsInfo();
    store.version = osInfo.version;
    store.channel = osInfo.os;
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
  myShare() {
	  	return {
	  		title: "保单管家小程序", 
	  		path: "/pages/policyList/policyList",
	  		// #ifdef MP-WEIXIN
	  		imageUrl: 'https://bx.wts999.com/m/resource/xcxStatic/shrepolicy.jpg',
	  		// #endif
			// #ifdef MP-ALIPAY
			content: "理赔专人服务，保单一键分享，便捷分类管理，快来邀请家人一起管理保单吧！",
	  		bgImgUrl: 'https://bx.wts999.com/m/resource/xcxStatic/shrepolicyZfb.jpg',
			// #endif
	  	}
  }
};

export default tools;
