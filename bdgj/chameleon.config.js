
// 设置静态资源的线上路径
// const publicPath = '';
// 设置api请求前缀
//dev环境
// const devHttpUrl = 'http://192.168.33.33:8080';
const devHttpUrl = 'https://bx.wts9999.net';
//const devHttpUrl = 'https://bx.wts999.com';
//build环境
// const buildHttpUrl = 'https://bx.wts9999.net';  //测试
// const buildHttpUrl = 'https://bx-web.wts999.com';  //预发布
const buildHttpUrl = 'https://bx.wts999.com'; //正式

//静态资源目录
//dev环境
// const publicPath = 'https://bx-web.wts999.com/m/xcxStatic/'; // 测试
// const publicPath = '/';
//build 环境
const publicPath = 'https://bx.wts999.com/m/xcxStatic/';
// const publicPath = 'https://bx-web.wts999.com/m/xcxStatic/'; // 预发布

cml.config.merge({
  templateLang: "cml",
  templateType: "html",
  // platforms: ["wx","alipay"],
  platforms: ["wx"],
  buildInfo: {
    wxAppId: 'wx647f23f59d34653e',    //保单管家测试
    alipayAppId: '2019070265727389'
    // wxAppId: 'wx2f37768dbc17af85'   //保单管家正式
    // wxAppId: "wxcf6de2f6fc4c5fd7"   //蜡烛宝贝
  },
  wx: {
    dev: {
      apiPrefix:devHttpUrl,
      definePlugin: {
        'process.env.STATIC' : JSON.stringify(publicPath)
      }
    },
    build: {
      apiPrefix:buildHttpUrl,
      publicPath: publicPath,
      definePlugin: {
        'process.env.STATIC' : JSON.stringify(publicPath)
      }
    }
  },
  alipay: {
    dev: {
      apiPrefix:devHttpUrl,
      definePlugin: {
        'process.env.STATIC' : JSON.stringify(publicPath)
      }
    },
    build: {
      apiPrefix:buildHttpUrl,
      publicPath: publicPath,
      definePlugin: {
        'process.env.STATIC' : JSON.stringify(publicPath)
      }
    }
  },
  web: {
    dev: {
      analysis: false,
      console: false,
      apiPrefix:devHttpUrl
    },
    build: {
      analysis: false,
      publicPath: `${publicPath}/web/`,
      apiPrefix:buildHttpUrl
    }
  },
  weex: {
    dev: {
      apiPrefix:devHttpUrl
    },
    build: {
      // publicPath: `${publicPath}/weex/`,
      apiPrefix:buildHttpUrl
    },
    custom: {
      // publicPath: `${publicPath}/wx/`,
      apiPrefix:buildHttpUrl
    }
  }
})

